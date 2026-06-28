# Voice caddie: the `solve_putt` server tool

How the ElevenLabs aime-caddie reads a real putt **on a call**, not just in the
app. Today `solve_putt` is wired as an app-side CLIENT tool
(`src/components/caddie/ElevenLabsCaddie.tsx`), which only works inside the web
app. To give the voice agent a real read on a phone call (or in Switchboard),
the same contract has to be a **server tool**: the agent calls the deployed
backend `POST /api/solve_putt` directly.

## Prerequisites (gated / later)

1. The putt-solver is **deployed** (PER-630) and you have the backend URL
   (`render.yaml` / docker-compose make this ready).
2. **Coordinates exist.** A bare phone call has no GPS, so the agent can only
   call this tool when the app is alongside the call and has supplied
   `ball_wgs84` / `cup_wgs84` / `stimp` (GPS + tap-the-puck), or the RTK puck is
   in play. Until then the hardened prompt is correct to defer to the app read.
   This tool is the convergence point for **app-accompanied** calls.

## The tool config (ElevenLabs convai webhook tool)

Add to the aime-caddie agent (replace the URL with the deployed backend):

```json
{
  "type": "webhook",
  "name": "solve_putt",
  "description": "Get the real read for the golfer's current putt: aim line, initial speed, and the break path. Call this ONLY when the app has supplied the ball and cup GPS and the green stimp for this putt. Returns instruction_text to speak, plus aim_line_deg, initial_speed_mph, and plot_points_local.",
  "response_timeout_secs": 20,
  "api_schema": {
    "url": "https://REPLACE-WITH-DEPLOYED-BACKEND/api/solve_putt",
    "method": "POST",
    "request_headers": { "Content-Type": "application/json", "X-AIME-Tool-Secret": "<your SOLVE_PUTT_TOOL_SECRET>" },
    "request_body_schema": {
      "type": "object",
      "required": ["course_id", "hole_id", "ball_wgs84", "cup_wgs84", "stimp"],
      "properties": {
        "course_id": { "type": "string", "description": "Course id in lowercase_snake_case, e.g. riverside_country_club" },
        "hole_id":   { "type": "integer", "description": "Hole number 1-18" },
        "ball_wgs84": {
          "type": "object", "description": "Ball position (WGS84)",
          "properties": { "lat": { "type": "number" }, "lon": { "type": "number" } },
          "required": ["lat", "lon"]
        },
        "cup_wgs84": {
          "type": "object", "description": "Cup position (WGS84)",
          "properties": { "lat": { "type": "number" }, "lon": { "type": "number" } },
          "required": ["lat", "lon"]
        },
        "stimp": { "type": "number", "description": "Green stimp, typically 8-14" }
      }
    }
  }
}
```

Mirrors `contracts/schemas/tool.solve_putt.args.schema.json` (the source of
truth) and the backend route the screen uses, so screen and voice return the
same read.

## How to add it

- ElevenLabs dashboard: Agent (aime-caddie) > Tools > Add tool > Webhook, paste
  the config above, set the URL.
- Or extend `scripts/aime-agent.sh` with a `tool <backend_url>` action that
  PATCHes the agent's `prompt.tools` (operator-run, mirrors the `apply` action).

## Auth (implemented)

The backend supports a shared-secret gate (`backend/routers/solve_putt.py`): set
`SOLVE_PUTT_TOOL_SECRET` on the deployed backend and callers must send a matching
`X-AIME-Tool-Secret` header. Verified end-to-end: 401 without / with a wrong
secret, 200 with the right one; unset = open (local dev / the same-origin app
client, backward compatible). When wiring the EL tool, add `X-AIME-Tool-Secret`
as a tool secret header (secret header, not HMAC, per our EL convention) with the
same value. The solver returns no PII, but the endpoint should not be open to the
internet once deployed.

## Prompt note

Keep the hardened prompt's discipline: the agent asks for / relies on the app
read and never invents numbers. With this tool live, the difference is that when
the app HAS supplied coordinates, the agent calls `solve_putt` and speaks the
real `instruction_text` instead of deferring.
