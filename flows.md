# Study Log flows

**Main task:** I log a study session → it counts toward my week → I come back on Thursday, and my progress is still there.

```mermaid
flowchart TD
  open([Open Study Log]) --> load{Anything saved<br/>on this device?}
  load -- "storage blocked" --> warn[Notice: this browser isn't saving.<br/>Tool still works for this visit] --> first

  %% 1. First visit
  load -- "no" --> first["<b>/ Today · first visit</b><br/>What did you study today?<br/>One-tap starters + Log a session"]
  first -- "tap a starter<br/>(Reading · 25 min)" --> saved
  first -- "Log a session" --> form

  %% 2. Main task: the form
  form["<b>/log · Log a session</b><br/>What · Minutes · Where · Day<br/>last values prefilled, draft saved as you type"] --> submit{Valid?}
  submit -- "no" --> errors["Errors next to each field<br/>say what to do next<br/>typed values kept, focus on first error"] --> form
  submit -- "yes" --> saved[(Saved to localStorage)]

  %% 3. It's on my list
  saved --> week["<b>/week · This week</b><br/>Progress toward 10 h · 7-day strip<br/>sessions by day"]
  week --> toast["Toast: Logged 25 min of Reading · Undo"]
  toast -- "Undo" --> removed[Session removed] --> week
  week -- "Log another" --> form

  %% 4. Coming back
  load -- "yes" --> sameWeek{Same week as<br/>last visit?}
  sameWeek -- "yes" --> back["<b>/ Today · welcome back</b><br/>Progress, minutes left, pace<br/>Log again: last session"]
  sameWeek -- "no, new week" --> newWeek["Welcome back · New week<br/>Last week you studied 6 h 10 m"] --> back
  back -- "Log again (one tap)" --> saved
  back -- "Log a session" --> form
  back -- "This week" --> week
```

## States per page

| Page | Empty / first | Loading | Error | Success |
|---|---|---|---|---|
| `/` | Starters, empty 7-day strip as an invitation | Skeleton until storage is read | "Not saving" notice | Welcome back with progress |
| `/log` | Prefilled defaults | Skeleton | Field errors with next step | Redirect to `/week` with toast |
| `/week` | "No sessions this week yet" + Log a session | Skeleton | "Not saving" notice | Toast with Undo |
