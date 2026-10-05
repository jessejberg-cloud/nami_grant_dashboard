// Every word a person reads to learn Grant Radar lives here, once. The app's
// Help page, the tour, the page tips, and the build's manual.html,
// quickstart.html, PDF, Word and Markdown files all read from this file, so
// they cannot drift apart.

export const TOUR = [
  {target:null, title:'Welcome to Grant Radar',
    body:'Grant Radar keeps your grant leads in one calm list, so you can see what is coming up and what to look at next. Five quick tips. You can skip at any time.'},
  {target:'nav-Leads', title:'Your leads',
    body:'Every grant you are keeping an eye on lives here. Tap one to see why it might fit, what is still unknown, and your next step.'},
  {target:'add-lead', title:'Add a lead',
    body:'Found a grant? Add it here. Only the name is needed. Everything else can wait.'},
  {target:'nav-Find grants', title:'Find grants',
    body:'Pick your topics and area once. Then one tap opens a ready-made web search.'},
  {target:'nav-Send', title:'Send to the Grant Dashboard',
    body:'When a lead looks good, send it to the Grant Dashboard in three steps. Radar remembers what you already sent.'},
  {target:'nav-Help', title:'Help is always here',
    body:'The quick start, the full manual, and this tour live under Help. You can practise on the made-up lead without changing anything real.'}
];

export const TIPS = {
  Home:'This is your at-a-glance view. Tap any card to see those leads.',
  Leads:'Tap a lead to open it. Search looks through names, funders, owners and notes.',
  'Find grants':'Your topics and area are saved as you tap them. The search buttons open a new tab.',
  Send:'Pick leads, save the file, then import it in the Grant Dashboard. That is the whole trip.',
  Help:'Start with the quick start. The manual has the rest.'
};

export const QUICK_START = {
  title:'Grant Radar quick start',
  intro:'Grant Radar is a list of grant leads that might suit NAMI Southeast Wisconsin. It helps you decide what to look at next and passes good leads to the Grant Dashboard. It does not apply for grants or decide who qualifies.',
  steps:[
    ['Open it','Open the Grant Radar link. Nothing to install and no account to make. A short tour starts the first time; skip it if you like.'],
    ['Look at Home','Home shows what is due in the next 30 days, what needs checking, and what is shortlisted. Tap a card to see those leads.'],
    ['Open a lead','Go to Leads and tap one. You will see why it might fit, what is still unknown, and any deal-breakers.'],
    ['Write a next step','In the lead, type in Next step. It saves by itself when you click away.'],
    ['Check the funder\'s page','Tap "Open funder\'s page". When you have read it, tap "I checked the page" and note what you saw. Changes to the deadline or amount get a small "changed" mark.'],
    ['Add a lead','Tap "+ Add a lead". Only the name is needed. Paste the link from the funder\'s page if you have it.'],
    ['Send good leads on','Go to Send. Tick the leads, tap "Save the file", then in the Grant Dashboard open Settings, choose Import records, and pick that file.'],
    ['Keep a backup','In Help, under Your data, tap "Save a backup" once in a while. You can open it on another computer.']
  ],
  safety:'Use public information only. Do not enter client, donor, staff or financial details.'
};

// Manual sections. `html` is a small, safe subset (p, ul, ol, li, strong, em)
// so the build can turn it into Markdown and Word without a parser.
export const MANUAL = [
  {id:'what', title:'What Grant Radar is', html:`
<p>Grant Radar is a list of grant leads. A lead is a grant that <em>might</em> suit NAMI Southeast Wisconsin. Radar helps you notice what is coming up, keep track of what you still need to find out, and pass good leads to the Grant Dashboard.</p>
<p>Radar does not apply for grants, contact funders, or decide whether we qualify. People make those calls. Radar just keeps the facts and your notes in one place.</p>
<p>It works in any modern web browser on a computer, tablet or phone. There is nothing to install.</p>`},
  {id:'open', title:'Opening it the first time', html:`
<p>Open the Grant Radar link. The first time, a short tour points at each part of the screen. Use <strong>Next</strong> to move on or <strong>Skip tour</strong> to start straight away. You can take the tour again any time from <strong>Help</strong>.</p>
<p>Radar starts with four real leads found on public funder pages, and one <strong>practice lead</strong> that is made up. The practice lead has a purple <strong>Practice</strong> tag. Try anything on it; nothing real changes.</p>
<p>Each page has a one-line tip at the top. Tap <strong>Got it</strong> to hide it. To see the tips again, go to Help and tap <strong>Show page tips again</strong>.</p>`},
  {id:'home', title:'Home', html:`
<p>Home is the at-a-glance view. Three cards show:</p>
<ul><li><strong>Due in 30 days</strong>: leads with a deadline in the next month.</li><li><strong>Needs checking</strong>: leads with open questions, a funder page you have not looked at for a while, or a recent change.</li><li><strong>Shortlisted</strong>: leads you have marked as worth pursuing.</li></ul>
<p>Tap a card to see those leads. Below the cards, <strong>Coming up</strong> lists the next deadlines in date order.</p>`},
  {id:'leads', title:'Finding a lead', html:`
<p>The <strong>Leads</strong> page lists every lead, soonest deadline first. Leads with no deadline come last.</p>
<p>Type in <strong>Search</strong> to narrow the list by name, funder, owner or notes. The buttons under it switch between <strong>Active</strong>, <strong>Needs checking</strong>, <strong>Shortlisted</strong>, <strong>Put away</strong> (not for us, archived or closed), and <strong>All</strong>.</p>
<p>Each row shows the deadline. A deadline within 30 days has a soft amber mark. A small dot means something on the funder's page changed since you last looked.</p>`},
  {id:'lead', title:'Inside a lead', html:`
<p>Tap a lead to open it. At the top are the deadline, the amount, and when someone last checked the funder's page.</p>
<p><strong>Status.</strong> Tap one of the status buttons to change it: New, Needs checking, Looking into it, Shortlisted, Not for us, Archived, Closed.</p>
<p><strong>Owner, Next step and Notes</strong> save by themselves when you click away. There is no Save button to forget.</p>
<p><strong>Why it might fit</strong>, <strong>Still to find out</strong> and <strong>Deal-breakers</strong> spell out the reasoning. Radar never gives a lead a hidden score. A promising lead can still turn out not to suit us.</p>
<p><strong>More details</strong> opens the rest: who can apply, area, how to apply, matching funds, restrictions and time zone.</p>`},
  {id:'add', title:'Adding and editing a lead', html:`
<p>Tap <strong>+ Add a lead</strong>. Only the name is needed. If you can, add the funder, the link to the funder's page, the deadline and the amount.</p>
<p>For the deadline, choose <strong>Date</strong>, <strong>Rolling</strong> (they accept applications any time) or <strong>Not sure</strong>.</p>
<p><strong>More details</strong> holds the rest, including the reasons it might fit and what is still unknown. Put one item per line.</p>
<p>If a lead with the same ID, or the same name and link, already exists, Radar says so and opens nothing new. That keeps your notes in one place.</p>
<p>To edit later, open the lead and tap <strong>Edit details</strong>.</p>`},
  {id:'check', title:'Checking the funder\'s page', html:`
<p>Funders change dates and amounts. When you have read a funder's page, open the lead and tap <strong>I checked the page</strong>. Note the date you looked and anything you saw: the deadline, the amount, whether it is open, how to apply.</p>
<p>If the deadline, amount, time zone, restrictions or way to apply changed, Radar marks the lead <strong>changed</strong> and says what changed. Your notes, owner, status and next step are never overwritten. Tap <strong>OK, noted</strong> to clear the mark.</p>
<p>A page not checked for more than 30 days shows <strong>Time for a fresh look</strong>.</p>`},
  {id:'put-away', title:'Putting a lead away, and undo', html:`
<p>Tap <strong>Archive</strong> to put a lead away. A message appears with <strong>Undo</strong>. Archived leads are kept; find them under <strong>Put away</strong> on the Leads page and change their status to bring them back.</p>
<p>Nothing in Radar is deleted for good.</p>`},
  {id:'find', title:'Finding new grants', html:`
<p>The <strong>Find grants</strong> page holds your search preferences: area, topics, who can apply, amount, what to skip, and search words. Tap to turn each one on or off. They save straight away.</p>
<p>The search buttons open a ready-made search in a new tab: the web, Grants.gov, the Greater Milwaukee Foundation, and Wisconsin community foundations. When you find something, come back and add it as a lead.</p>
<p>Radar does not search on its own. A weekly automatic search needs the agency to set up its own account and scheduler. Until then, searching is done by people, using these buttons.</p>
<p>Preferences are not facts about the agency. Whether we qualify is always checked on the funder's page.</p>`},
  {id:'send', title:'Sending leads to the Grant Dashboard', html:`
<p>The <strong>Send</strong> page moves leads into the Grant Dashboard in three steps:</p>
<ol><li><strong>Pick leads.</strong> Shortlisted and in-progress leads that have not been sent are ticked for you. Change the ticks as you like.</li><li><strong>Save the file.</strong> Tap <strong>Save the file</strong>. Radar saves a small .json file and marks those leads <strong>Sent</strong>.</li><li><strong>Import it in the Dashboard.</strong> Tap <strong>Open the Grant Dashboard</strong>. There, go to <strong>Settings</strong>, choose the <strong>Agency</strong> workspace (or <strong>Sample</strong> for practice leads), tap <strong>Import records</strong> and choose the file.</li></ol>
<p>Why Radar leaves Sent leads out: the Dashboard turns away the whole file if even one lead in it is already there. If you need to send one again, tick it by hand. Delete the old copy in the Dashboard first.</p>
<p>Practice leads are sent on their own, so they land in the Dashboard's Sample workspace and never mix with real ones.</p>
<p>A lead sent to the Dashboard is still a lead. It does not become an award there until someone decides it is one.</p>`},
  {id:'data', title:'Where your work is saved', html:`
<p>Radar saves as you go. When you open it through a Claude link while signed in, your leads are also kept with your Claude account, so they follow you to another computer. Otherwise they are saved in this browser on this computer.</p>
<p>Clearing your browser's data, using a private window, or switching browsers can hide leads saved only in the browser. So once in a while, go to <strong>Help</strong>, then <strong>Your data</strong>, and tap <strong>Save a backup</strong>.</p>
<p><strong>Open a file</strong> reads a Radar backup, a Radar send file, or a Grant Dashboard export. It adds leads you do not have and skips the ones you do. It never overwrites.</p>
<p><strong>Start fresh</strong> puts the starting leads back. It asks first, and offers Undo.</p>`},
  {id:'comfort', title:'Making it comfortable', html:`
<p>In Help, under <strong>Your data and comfort</strong>:</p>
<ul><li><strong>Larger text</strong> makes every word bigger.</li><li><strong>Still screen</strong> turns off movement and fades.</li></ul>
<p>Radar also follows your device's dark mode and reduced-motion settings.</p>`},
  {id:'trouble', title:'If something goes wrong', html:`
<ul><li><strong>My leads are gone.</strong> You may be in a different browser, a private window, or the browser's data was cleared. Open your latest backup with <strong>Open a file</strong>.</li><li><strong>The Dashboard says "A matching record is already present".</strong> One lead in the file is already in the Dashboard. Go back to Send, untick that lead, save again, and import the new file.</li><li><strong>The Dashboard says "Unable to read this file".</strong> Make sure you picked the .json file Radar saved, not a different file.</li><li><strong>The save button did nothing.</strong> Some viewers ask before saving a file. Look for a confirmation box. If none appears, use <strong>Copy instead</strong>, paste into a text file, and save it with a name ending in .json.</li><li><strong>Radar says a lead already exists.</strong> Open the existing lead instead, so all notes stay together.</li></ul>`},
  {id:'limits', title:'What Radar does not do yet', html:`
<ul><li>It does not search the web on its own. Weekly automatic searching needs agency setup: a scheduler, accounts, a shared database, and someone responsible for it.</li><li>It is not shared between staff. Each person's Radar is their own. Use the Grant Dashboard as the shared place.</li><li>It does not check eligibility. A person reads the funder's rules.</li><li>It is not built for private information. Use public information only.</li></ul>`}
];

export const GLOSSARY = [
  ['Lead','A grant that might suit us. Not an application and not an award.'],
  ['Practice lead','A made-up lead for learning. It has a purple Practice tag.'],
  ['Rolling','The funder accepts applications at any time.'],
  ['Needs checking','Something about this lead is still unknown, or its page has not been looked at for a while.'],
  ['Shortlisted','Worth pursuing. Usually the next stop is the Grant Dashboard.'],
  ['Put away','Leads marked Not for us, Archived or Closed. Kept, out of the way.'],
  ['Sent','Already saved in a file for the Grant Dashboard.'],
  ['Deal-breaker','Something that rules this lead out, like a closed cycle.'],
  ['Backup','A file holding all your leads and preferences, to keep safe or move to another computer.']
];
