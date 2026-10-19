# Study Log

Log your study sessions and watch them add up toward a weekly goal. Built for MPCS 51238 Design, Build, Ship, Assignment 3 (Patterns & Flows).

**Live:** _deploying soon_ · **Style:** the Calm design system from [Assignment 2](https://study-spots-alpha.vercel.app/design-systems/calm)

## Who it's for

A university student who studies in cafés and libraries around campus and wants a simple answer to "Am I putting in enough hours this week?" Assignment 2 told you where to study; Study Log keeps track of how much you studied.

**Main task:** I log a study session → it counts toward my week → I come back on Thursday, and my progress is still there.

## Flows

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

Pages: `/` Today (first visit and coming back), `/log` Log a session, `/week` This week. More detail, including the states on each page, is in [flows.md](flows.md).

## How similar tools welcome someone new

Three subagents studied how these tools onboard a new user. Here's what we borrowed and what we left out.

| Tool | First screen | Time to something useful | Brings people back | What Study Log uses |
|---|---|---|---|---|
| **Streaks** (habit tracker) | Straight into "add a habit," with suggested habits. No account. | A few taps | Streak rings; a missed day resets to zero | One-tap starters on the first visit; a plain button with Undo instead of hold-to-complete; a 7-day strip that shows which days you studied |
| **Forest** (focus timer) | Five welcome slides, then the timer. Sign-up comes later. | About a minute, because of the slides | A growing forest, coins, and missions | No tour and no sign-up. Last course, minutes, and place are remembered so you don't start over each time. The empty week is shown as slots waiting to be filled. |
| **Toggl Track** (time tracker) | Sign-up questions, then a skippable tour | Press Play; every field is optional | Goals on the home screen, weekly emails | Weekly goal progress and pace lead the returning screen. Smart defaults, and Today/Yesterday shortcuts for the day field. Empty pages always offer a next step. |

Left out on purpose: sign-up questions, guided tours, and a getting-started checklist. Someone new should log something useful in one tap.

## Saved on this device

Everything lives in the browser's `localStorage` under `study-log:v1`. There are no accounts, database, or network calls. If the browser blocks storage, the tool still works for that visit and says it isn't saving.

## Accessibility

_To be filled in after the accessibility pass._

## First-run check

_To be filled in after deploy: an agent tries the live tool as a brand-new user._

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```
