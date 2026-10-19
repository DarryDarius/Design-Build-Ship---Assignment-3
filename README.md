# Study Log

Log your study sessions and watch them add up toward a weekly goal. Built for MPCS 51238 Design, Build, Ship, Assignment 3 (Patterns & Flows).

**Live:** https://study-log-ashy.vercel.app · **Style:** the Calm design system from [Assignment 2](https://study-spots-alpha.vercel.app/design-systems/calm)

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

I had the agent check the production build in a real browser with Playwright, at 390px and 1440px:

- **Keyboard:** every page was tabbed through and every stop shows a visible focus ring. The whole task works by keyboard: type into the form, press Enter to save, and Undo from the toast.
- **Labels:** every input and select has a real `<label>`. Hints and errors are tied to their field with `aria-describedby`, and invalid fields get `aria-invalid`. After a failed submit, focus moves to the first error.
- **Contrast:** a script measured every visible piece of text against the background behind it, on every page, both empty and filled. All text is at least 4.5:1. Body text is 13.2:1, muted text 5.3:1, errors 6.4:1, and white on the clay button 6.5:1.
- **Screen readers:** the "Logged … · Undo" toast sits in a live region, and the weekly progress bar has a text value ("1h 15m of 10h"). Each day in the strip is read out ("Monday (today): 1h 15m").
- **Motion:** animations are turned off for people who prefer reduced motion.

## First-run check

After deploying, I gave a separate agent only the live URL and a goal: *"You're a university student. Log three study sessions you did this week. Then come back later and use it again."* It hadn't seen the code. It drove a real browser at phone and desktop sizes, made honest mistakes on purpose, used only the keyboard for one full path, and moved the clock forward to come back on later days.

**First impression (in its words):** "It's a study timer-log with a 10-hour weekly goal. The big question 'What did you study today?' and the 'Log a session' button tell me what to do right away."

**What worked:**
- The form is short, and the chips make it fast.
- Errors sit next to the field and say what to do. Typed input is kept, and focus moves to the first error.
- After saving you land on the week with the new session highlighted, and Undo works.
- The week view is easy to read.
- Keyboard use works, with visible focus throughout.

**What it found, and what I changed:**

| Severity | Finding | Change |
|---|---|---|
| High | On a Monday, logging "Yesterday" (Sunday) said "Logged" but the week page showed nothing, because the session was in last week. A mistyped year was accepted and then unreachable. | Added a **Last week** view; saving a session from last week goes straight there. The toast now names the day ("…yesterday."). The day must be this week or last week ("Pick a day this week or last week."). |
| Medium | The form prefilled the last course, so tapping and typing produced "Organic ChemCalculus II". | The course field starts empty, and recent courses are one-tap chips. Minutes are still prefilled and select all on focus, so typing replaces them. |
| Medium | "Log again" saves in one press, and a stray Enter made a duplicate. | After any save, keyboard focus lands on **Undo**, so a mistake is one key away. |
| Low | The toast couldn't be closed with Esc. | Esc closes it. |
| Low | "3h 54m behind pace" read like a scolding. | Reframed as what's still doable: "About 1h 05m a day reaches 10h by Sunday". |
| High | You can't edit or delete a session once the toast is gone. | Not changed for now. In planning I chose Undo only and left out delete to keep the tool simple. *(Decision pending.)* |

**On coming back, it said:** "Partly. 'Welcome back', the week bars and a one-tap 'Log again' make logging again obvious and quick." It wanted to see last week (now added) and suggested history and per-course patterns as next steps.

Every fix was checked again in the browser, and the full test suite passes on the live site.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```
