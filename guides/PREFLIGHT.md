# Before the first email goes out

*For Jesse. Seven steps, in this order. Each one says how to check it worked. About an hour in all.*

## 1. Turn on the landing page (5 minutes)

On GitHub, open the repository **nami_grant_dashboard** → **Settings** → **Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/docs**, and press **Save**.

**Check:** about a minute later, open https://jessejberg-cloud.github.io/nami_grant_dashboard. You should see three program cards, the guides and the handbook. Press **Open Grant Radar**; it should open with its tour.

## 2. Bring the live Grant Dashboard up to date (15 minutes)

Open the ChatGPT project that built and publishes the Grant Dashboard Site, and paste this:

> The code for this Site is in the GitHub repository https://github.com/jessejberg-cloud/nami_grant_dashboard, branch main, at the repository root. The folders grant-radar, volunteers-and-events, guides, docs and archive are separate programs and documents, not part of this Site. Bring this Site's project up to the latest commit on main. Keep the Site's identity in .openai/hosting.json and do not create a new Site. Run the existing checks (node --test tests/records.test.cjs, the TypeScript check, and the production build), then publish. Do not reset, reseed or change any records.

**Check (2 minutes):** open https://nami-grant-workspace.brainspottingonline.chatgpt.site, go to **Help**. The list of guides should end with **"The NAMI landing page: all three programs and their guides."** If it does not, the publish did not take the new code; tell me what ChatGPT reported.

## 3. Invite the volunteer coordinator to Volunteers & Events (5 minutes)

Open https://claude.ai/artifact/EDapVYL3SAdAPKV7duNK1H, open the **Share** menu, and invite the coordinator's email as an **Editor**. Only the coordinator for now; others are invited when they need it.

**Check:** the coordinator receives an email from Claude. The top right of the page shows "Saved for everyone with this link" for anyone invited.

## 4. Create the feedback address (10 minutes)

Create a free email address used only for NAMI feedback, for example a new Gmail. Send it to me and I will switch on the landing page's feedback button. It can be handed to NAMI's internal person in phase two.

**Until then** the landing page says "reply to the email that brought you here", which works.

## 5. Fill the blanks in the emails (10 minutes)

In the handbook's appendix, or guides/EMAILS.md: the Executive Director's name, your phone number in all four, and leave **[name]** in the three program emails for the Executive Director to fill in when forwarding.

## 6. Print the handbook (15 minutes)

Print https://jessejberg-cloud.github.io/nami_grant_dashboard/guides/NAMI_Dashboard_Suite_Handbook.pdf, double-sided, with a tab divider before each page that says **Chapter** or **Appendix**. Suggested copies:

- 1 for you
- 1 for the Executive Director
- 1 for the volunteer coordinator
- 1 for the grants person
- 1 spare for the office, to file with the new-hire documents

The Word copy, on the landing page, is for adding notes or local details before printing.

## 7. Send the overview to the Executive Director

Send email 1 from the appendix, with the handbook's link in it. Offer to walk through it in person with the printed copy.

**Then:** the Executive Director forwards email 2 (Volunteers & Events) in week 1, email 3 (Grant Dashboard) in week 2, and email 4 (Grant Radar) any time after. You are copied each time; that is your cue to book each walkthrough.

## After sending

- Book each owner's 20-minute walkthrough in their first week.
- At the end of week 2 and week 4, email each owner the three check-in questions from chapter 2.
- Before the week-4 decision, read GAPS.md and IMPLEMENTATION-ANALYSIS.md again with the owners' answers in hand.
