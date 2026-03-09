---
name: da-style
description: Apply Tailwind CSS styles following the project's design system and art direction. Use when creating/styling components, updating UI, or when users mention "style", "design", or "tailwind".
---

# Design System & Tailwind Style Guide

You are a design system specialist for the Curious Labs application. Your role is to ensure all UI components follow the established art direction, color palette, and Tailwind CSS v4 conventions.

## Art Direction (DA) - RPG Adventure Theme 🎮

### Brand Identity: "Your Dev Adventure Awaits"

**Core Concept:** Curious Labs is not a learning platform—it's an **epic adventure** where developers become heroes. Like Final Fantasy XIV or Zelda, every formation is a **quest**, every skill learned is a **power unlocked**, and every developer is on a **journey to greatness**.

**Target Audience:** Developers and tech leads ready to **embark on an adventure** to level up, become hireable legends, or secure their position as invaluable team members.

### The Hero's Journey (User's Mission)

**Central Goal:** Transform from "current dev" → **"Enhanced, Empowered, Employable Dev"**

The user is the **Hero/Adventurer** on a quest to:
1. 🗡️ **Master new skills** (unlock abilities)
2. 🎯 **Complete quests** (formations/cursus)
3. 🏆 **Earn rewards** (badges, achievements, certifications)
4. 📈 **Level up** (improve capabilities, become hireable)
5. 🌍 **Explore the dev world** (discover new technologies)

### Tone & Personality (RPG-Inspired)

- 🔥 **Epic & Motivating** - "Your adventure starts NOW"
- ⚔️ **Heroic** - You're not learning, you're conquering
- 🎮 **Gamified to the Core** - XP, levels, quests, loot, achievements
- 🌟 **Curious & Adventurous** - "What lies beyond this quest?"
- 💪 **Empowering** - "You WILL become unstoppable"
- 🎯 **Goal-Oriented** - Clear objectives, visible progress, satisfying completion

### Visual Strategy: The Adventure Aesthetic

**Think:** FF14 UI + Zelda exploration + Modern RPG polish

1. **Bold & Vibrant** - Not subtle, not corporate, ENGAGING
2. **Progress-Driven** - Everything shows advancement (XP bars, quest trackers, completion %)
3. **Reward-Centric** - Achievements are CELEBRATED, not just listed
4. **Interactive & Alive** - Hover effects, transitions, micro-animations
5. **Immersive** - The UI feels like a game menu, not a website

### Vocabulary & Terminology (RPG Language)

**Replace boring terms with adventure language:**

| ❌ Old (Boring) | ✅ New (Epic) |
|----------------|--------------|
| Course / Formation | **Quête** / **Mission** |
| Student / User | **Aventurier** / **Héros** |
| Progress | **Progression** / **Avancement** |
| Complete | **Conquérir** / **Terminer** |
| Skills | **Compétences** / **Pouvoirs** |
| Level | **Niveau** / **Rang** |
| Start | **Partir en quête** / **Commencer l'aventure** |
| Continue | **Poursuivre la quête** / **Continuer l'aventure** |
| Objectives | **Objectifs de quête** |
| Rewards | **Récompenses** / **Butin** / **Trophées** |
| Badge | **Badge** / **Médaille** / **Insigne** |

## Color Palette: RPG Adventure Theme

### Base Colors (Structure & Content)

**Slate Tones** (Neutral base - like stone walls of a castle)
```css
--color-slate-50 to 900   /* Use Tailwind's slate palette */
```
- Backgrounds, text, borders, containers

### Action & Energy Colors

**Vibrant Orange-Red** (Fire, Energy, Action - like lava or flames)
```css
--color-orange-500: #f97316   /* Primary CTA */
--color-red-500: #ef4444      /* Urgency, important actions */
```
- **Primary CTAs**: "Partir en quête", "Commencer l'aventure"
- **Active states**: Current quest, in-progress
- **Energy/XP bars**: Use gradients from orange to red

**Electric Blue** (Magic, Progress - like mana or energy shields)
```css
--color-blue-500: #3b82f6
--color-cyan-500: #06b6d4
```
- **Quest markers**: New available quests
- **Info states**: Tips, guides, tutorials
- **Magic/Skill indicators**

### Reward & Achievement Colors (The Loot!)

**Legendary Gold** (Epic rewards - treasure chest glow)
```css
--color-yellow-400: #facc15   /* Gold glow */
--color-amber-500: #f59e0b    /* Warm gold */
```
- **Legendary rewards**: Gradient gold with glow effect
- **Achievements unlocked**: Shimmering gold
- **Completion badges**: Golden finish

**Epic Purple** (Rare, powerful items)
```css
--color-purple-500: #a855f7
--color-violet-600: #7c3aed
```
- **Epic tier rewards**
- **Rare achievements**
- **Special quests**

**Rare Emerald** (Uncommon, valuable)
```css
--color-emerald-500: #10b981
--color-green-500: #22c55e
```
- **Rare rewards**
- **Completed quests**: Success green
- **Skills mastered**

**Common Silver** (Basic rewards - still valuable!)
```css
--color-slate-300: #cbd5e1
--color-gray-400: #9ca3af
```
- **Common rewards**
- **Starting achievements**

### Semantic Colors (Game States)

**Success / Victory**
```css
--color-emerald-500   /* Quest completed! */
```

**Warning / Caution**
```css
--color-amber-500     /* Quest expiring soon */
```

**Danger / Challenge**
```css
--color-red-500       /* Difficult quest ahead */
```

**XP / Progress**
```css
/* Gradient from orange to red for progress bars */
bg-gradient-to-r from-orange-500 via-orange-600 to-red-500
```

### Color Usage Rules (RPG Context)

1. **Slate/Grey** - World structure (backgrounds, UI chrome)
2. **Orange/Red** - ACTION! Call to adventure, CTAs, energy
3. **Blue/Cyan** - Guidance, magic, special abilities
4. **Gold/Yellow** - LEGENDARY rewards, achievements
5. **Purple/Violet** - EPIC tier, rare items
6. **Emerald/Green** - SUCCESS, completion, rare tier
7. **Silver/Grey** - Common tier (still good!)

## Tailwind CSS v4 Guidelines

### Setup

Tailwind v4 uses CSS-first configuration. Define custom properties in your CSS:

```css
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-primary-*: ... ;
  --color-action-*: ... ;

  /* Custom spacing if needed */
  --spacing-unit: 0.25rem;
}
```

### RPG UI Patterns 🎮

#### 1. Buttons (Call to Adventure!)

**Epic Quest Button** (Primary - Start the adventure!)
```html
<button class="relative group overflow-hidden
               bg-gradient-to-r from-orange-500 to-red-600
               hover:from-orange-600 hover:to-red-700
               text-white font-bold px-8 py-4 rounded-xl
               shadow-lg hover:shadow-2xl hover:shadow-orange-500/50
               transition-all duration-300
               border-2 border-orange-400/50
               transform hover:scale-105 hover:-translate-y-0.5">
  <!-- Shine effect -->
  <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

  <span class="relative flex items-center gap-2">
    ⚔️ Partir en quête
    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
    </svg>
  </span>
</button>
```

**Continue Quest Button** (For in-progress quests)
```html
<button class="relative group
               bg-gradient-to-br from-blue-600 to-cyan-600
               hover:from-blue-700 hover:to-cyan-700
               text-white font-bold px-6 py-3 rounded-lg
               shadow-md hover:shadow-xl hover:shadow-blue-500/40
               transition-all duration-300
               border border-blue-400/50">
  <span class="flex items-center gap-2">
    🎯 Continuer l'aventure →
  </span>
</button>
```

**Secondary Action** (View details, explore)
```html
<button class="border-2 border-slate-300 hover:border-orange-400
               bg-white hover:bg-orange-50
               text-slate-700 hover:text-orange-600
               font-semibold px-6 py-3 rounded-lg
               transition-all duration-200
               shadow-sm hover:shadow-md">
  🗺️ Explorer les détails
</button>
```

#### 2. Quest Cards (The Heart of the Adventure!)

**Active Quest Card** (In-progress, glowing, calling you!)
```html
<article class="group relative overflow-hidden
                bg-gradient-to-br from-white via-orange-50/30 to-white
                border-2 border-orange-300 hover:border-orange-500
                rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/30
                transition-all duration-300
                transform hover:scale-[1.02] hover:-translate-y-1
                cursor-pointer">

  <!-- Quest glow effect -->
  <div class="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 opacity-0
              group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

  <!-- Content (relative to be above glow) -->
  <div class="relative p-6">
    <!-- Quest Type Badge -->
    <div class="absolute top-4 right-4">
      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                   bg-gradient-to-r from-orange-500 to-red-500
                   text-white text-xs font-bold shadow-lg animate-pulse">
        ⚡ EN COURS
      </span>
    </div>

    <!-- Quest Title -->
    <h3 class="text-2xl font-black text-slate-900 group-hover:text-orange-600
               transition-colors mb-2 leading-tight">
      🗡️ Nom de la Quête
    </h3>

    <!-- Quest Description -->
    <p class="text-slate-600 leading-relaxed mb-4">
      Description épique qui donne envie de commencer l'aventure...
    </p>

    <!-- XP Bar - see section below -->
  </div>
</article>
```

**Available Quest Card** (Ready to start - enticing!)
```html
<article class="group relative overflow-hidden
                bg-white border-2 border-slate-200 hover:border-blue-400
                rounded-2xl shadow-md hover:shadow-xl hover:shadow-blue-500/20
                transition-all duration-300
                transform hover:scale-[1.01]
                cursor-pointer">

  <!-- New quest shimmer -->
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent
              -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

  <div class="relative p-6">
    <!-- "New" indicator -->
    <div class="absolute top-4 right-4">
      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                   bg-blue-500 text-white text-xs font-bold shadow-md">
        ✨ NOUVELLE
      </span>
    </div>

    <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-600
               transition-colors mb-2">
      🎯 Nouvelle Quête Disponible
    </h3>

    <p class="text-slate-600 mb-4">
      Une nouvelle aventure vous attend...
    </p>
  </div>
</article>
```

**Completed Quest Card** (Victory achieved!)
```html
<article class="relative overflow-hidden
                bg-gradient-to-br from-emerald-50 to-white
                border-2 border-emerald-300
                rounded-2xl shadow-md
                opacity-75 hover:opacity-100 transition-opacity">

  <div class="p-6">
    <!-- Completion badge -->
    <div class="absolute top-4 right-4">
      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                   bg-gradient-to-r from-emerald-500 to-green-500
                   text-white text-xs font-bold">
        ✓ TERMINÉE
      </span>
    </div>

    <h3 class="text-xl font-bold text-emerald-900 mb-2">
      ✅ Quête Conquise
    </h3>

    <p class="text-emerald-700">
      Vous avez maîtrisé cette compétence!
    </p>
  </div>
</article>
```

#### 3. XP & Progress Bars (Show that advancement!)

**Epic XP Bar** (Animated, glowing, satisfying)
```html
<div class="space-y-2">
  <!-- Labels -->
  <div class="flex items-center justify-between">
    <span class="text-sm font-bold text-slate-700 uppercase tracking-wider">
      ⚡ PROGRESSION
    </span>
    <span class="text-lg font-black text-transparent bg-clip-text
                 bg-gradient-to-r from-orange-500 to-red-500">
      75%
    </span>
  </div>

  <!-- XP Bar Container -->
  <div class="relative h-4 bg-slate-200 rounded-full overflow-hidden
              border-2 border-slate-300 shadow-inner">

    <!-- Glow background -->
    <div class="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20"></div>

    <!-- Progress Fill -->
    <div class="relative h-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500
                rounded-full transition-all duration-700 ease-out
                shadow-lg shadow-orange-500/50"
         style="width: 75%">

      <!-- Shimmer effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                  animate-[shimmer_2s_infinite]"></div>

      <!-- Shine spots -->
      <div class="absolute inset-0 flex items-center justify-end pr-2">
        <div class="w-2 h-2 bg-white rounded-full opacity-75 animate-pulse"></div>
      </div>
    </div>
  </div>

  <!-- XP Text -->
  <p class="text-xs text-slate-500 text-right">
    2,250 / 3,000 XP
  </p>
</div>
```

**Level Indicator**
```html
<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-purple-600 to-violet-600
            text-white font-bold shadow-lg">
  <span class="text-2xl">⭐</span>
  <span>Niveau 12</span>
</div>
```

#### 4. Reward Badges (The Loot!)

**Legendary Reward** (Gold, glowing, EPIC!)
```html
<div class="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600
            border-2 border-yellow-300
            shadow-lg shadow-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/70
            transition-all duration-300
            transform hover:scale-110 cursor-pointer">

  <!-- Glow effect -->
  <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500
              opacity-50 blur-md group-hover:opacity-75 transition-opacity"></div>

  <!-- Content -->
  <span class="relative text-2xl animate-bounce">👑</span>
  <span class="relative text-yellow-900 font-black text-sm">
    LÉGENDAIRE
  </span>

  <!-- Sparkles -->
  <div class="absolute -top-1 -right-1">
    <span class="text-xs animate-pulse">✨</span>
  </div>
</div>
```

**Epic Reward** (Purple, rare)
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-gradient-to-r from-purple-500 to-violet-600
            border-2 border-purple-400
            text-white font-bold text-xs
            shadow-md shadow-purple-500/40 hover:shadow-lg
            transition-all duration-200 hover:scale-105">
  <span class="text-lg">💎</span>
  <span>ÉPIQUE</span>
</div>
```

**Rare Reward** (Green, success)
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-gradient-to-r from-emerald-500 to-green-500
            border border-emerald-400
            text-white font-semibold text-xs
            shadow-md hover:shadow-lg transition-all duration-200">
  <span class="text-base">🌟</span>
  <span>RARE</span>
</div>
```

**Common Reward** (Silver, still good!)
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-slate-300 border border-slate-400
            text-slate-800 font-medium text-xs
            shadow-sm">
  <span class="text-base">⚪</span>
  <span>COMMUN</span>
</div>
```

#### 5. Typography (Epic & Heroic!)

**Page Title** (Hero arrives!)
```html
<h1 class="text-5xl md:text-6xl font-black text-transparent bg-clip-text
           bg-gradient-to-r from-orange-500 via-red-500 to-orange-500
           mb-4 tracking-tight leading-tight">
  Votre Aventure Vous Attend
</h1>
```

**Section Title**
```html
<h2 class="text-3xl font-bold text-slate-900 mb-3 flex items-center gap-3">
  <span class="text-4xl">⚔️</span>
  <span>Vos Quêtes en Cours</span>
</h2>
```

**Quest Title**
```html
<h3 class="text-2xl font-bold text-slate-900 group-hover:text-orange-600
           transition-colors">
  Maîtriser Angular 21
</h3>
```

**Status Badge**
```html
<span class="inline-flex items-center px-3 py-1
             rounded-full text-sm font-medium
             bg-action-100 text-action-800
             border border-action-200">
  In Progress
</span>
```

**Count Badge**
```html
<span class="inline-flex items-center justify-center
             w-6 h-6 rounded-full
             bg-action-600 text-white text-xs font-bold">
  5
</span>
```

#### 5. Forms & Inputs

**Text Input**
```html
<input type="text"
       class="w-full px-4 py-3
              border-2 border-primary-300 rounded-lg
              focus:border-action-500 focus:ring-2 focus:ring-action-200
              transition-colors duration-200
              placeholder:text-primary-400
              text-primary-900"
       placeholder="Enter your answer...">
```

**Textarea**
```html
<textarea class="w-full px-4 py-3
                 border-2 border-primary-300 rounded-lg
                 focus:border-action-500 focus:ring-2 focus:ring-action-200
                 transition-colors duration-200
                 placeholder:text-primary-400
                 text-primary-900
                 resize-none"
          rows="4"
          placeholder="Describe your learning goal..."></textarea>
```

#### 6. Progress Indicators

**Progress Bar**
```html
<div class="w-full bg-primary-200 rounded-full h-3 overflow-hidden">
  <div class="bg-gradient-to-r from-action-500 to-action-600
              h-full rounded-full
              transition-all duration-500 ease-out"
       style="width: 65%">
  </div>
</div>
```

**Circular Progress (using arbitrary values)**
```html
<div class="relative w-16 h-16">
  <svg class="transform -rotate-90" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="28"
            class="fill-none stroke-primary-200"
            stroke-width="6"></circle>
    <circle cx="32" cy="32" r="28"
            class="fill-none stroke-action-600"
            stroke-width="6"
            stroke-dasharray="175.93"
            stroke-dashoffset="44"
            stroke-linecap="round"></circle>
  </svg>
  <div class="absolute inset-0 flex items-center justify-center
              text-sm font-bold text-primary-900">
    75%
  </div>
</div>
```

#### 7. Navigation

**Nav Link (Active State)**
```html
<a href="#"
   class="px-4 py-2 rounded-lg font-medium
          text-action-600 bg-action-50 border-l-4 border-action-600">
  Current Page
</a>
```

**Nav Link (Inactive)**
```html
<a href="#"
   class="px-4 py-2 rounded-lg font-medium
          text-primary-600 hover:text-primary-900
          hover:bg-primary-50 border-l-4 border-transparent
          transition-colors duration-200">
  Other Page
</a>
```

## Layout & Spacing

### Container Widths
- **Max width:** Use `max-w-7xl` for main content areas
- **Reading width:** Use `max-w-2xl` for text-heavy content
- **Card grids:** Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Spacing Scale
- **Section spacing:** `py-12` or `py-16` between major sections
- **Card padding:** `p-6` or `p-8` for larger cards
- **Element gaps:** `gap-4` or `gap-6` in flex/grid layouts
- **Inline spacing:** `space-x-2` for tight elements, `space-x-4` for comfortable spacing

## Animation & Transitions

### Standard Transitions
```html
<!-- Color transitions -->
transition-colors duration-200

<!-- All properties -->
transition-all duration-300

<!-- Shadows -->
transition-shadow duration-300

<!-- Transform -->
transition-transform duration-300
```

### Hover Effects

**Lift on Hover**
```html
hover:scale-105 hover:shadow-lg transition-all duration-300
```

**Glow Effect**
```html
hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow duration-300
```

## Accessibility

### MUST FOLLOW:
1. **Color contrast:** Ensure 4.5:1 ratio for text (WCAG AA)
2. **Focus states:** Always include `focus:ring-2 focus:ring-action-500 focus:outline-none`
3. **Interactive sizing:** Minimum 44x44px touch targets
4. **Semantic HTML:** Use proper elements (`<button>`, `<nav>`, `<main>`)

## Do's and Don'ts

### ✅ DO

- Use orange for primary CTAs and actions
- Use blue-grey for content and structure
- Add smooth transitions (200-300ms)
- Include hover states on interactive elements
- Use shadows subtly (sm, md) not heavily
- Keep rounded corners consistent (lg, xl)
- Use font weights purposefully (medium, semibold, bold)

### ❌ DON'T

- Mix too many colors - stick to the palette
- Use harsh shadows or borders
- Create jarring transitions (> 500ms)
- Forget focus states on interactive elements
- Overuse orange - it's for emphasis only
- Use generic grey - always use primary tones
- Ignore spacing scale - use Tailwind spacing units

## Angular Code Quality Requirements

**MANDATORY:** When applying styles to a component, also verify its TypeScript follows these non-negotiable Angular standards:

### 1. `ChangeDetectionStrategy.OnPush` — ALWAYS

Every component MUST have `changeDetection: ChangeDetectionStrategy.OnPush`. No exceptions.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 2. No Signal Reads Inside Template-Called Methods

Any method called from a template that internally reads a signal (`this.someSignal()` or `this.someComputed()`) **MUST** be converted to a `computed`.

**❌ BAD — hides signal read in method called from template:**
```typescript
// Template: @if (getPosition(node.objective.id); as pos)
getPosition(id: string) {
  return this.positions().find(p => p.id === id); // reads signal!
}
```

**✅ GOOD — computed Map:**
```typescript
readonly positionMap = computed(() =>
  new Map(this.positions().map(p => [p.id, p]))
);
// Template: @if (positionMap().get(node.objective.id); as pos)
```

### 3. Derived Values → `computed`, Never Methods

Values derived from `input()` signals must be `computed()` properties, not methods.

---

## Component Checklist

When creating/styling a component, verify:

- [ ] `ChangeDetectionStrategy.OnPush` is set in the decorator
- [ ] No method called from a template reads a signal internally
- [ ] All values derived from `input()` signals use `computed()`
- [ ] Colors match the blue-grey / orange palette
- [ ] Interactive elements use orange on hover/active
- [ ] Transitions are smooth (200-300ms)
- [ ] Focus states are visible and accessible
- [ ] Spacing follows the scale (4, 6, 8, 12, 16)
- [ ] Rounded corners are consistent
- [ ] Shadows are subtle (sm, md)
- [ ] Typography hierarchy is clear
- [ ] Mobile responsive (sm, md, lg breakpoints)

## Examples of Good Components

### Quest Card Example
```html
<article class="group bg-white border-2 border-primary-200 rounded-xl
                hover:border-action-500 shadow-sm hover:shadow-md
                transition-all duration-300 p-6 cursor-pointer">

  <!-- Badge -->
  <div class="flex items-center justify-between mb-4">
    <span class="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-semibold bg-action-100 text-action-800">
      3/5 Complete
    </span>
    <span class="text-sm text-primary-500">2 hours</span>
  </div>

  <!-- Title -->
  <h3 class="text-xl font-bold text-primary-900
             group-hover:text-action-600 transition-colors mb-2">
    Master Prompt Engineering
  </h3>

  <!-- Description -->
  <p class="text-primary-600 leading-relaxed mb-4">
    Learn advanced prompting techniques to get better results from AI models.
  </p>

  <!-- Progress Bar -->
  <div class="w-full bg-primary-200 rounded-full h-2 overflow-hidden mb-4">
    <div class="bg-gradient-to-r from-action-500 to-action-600
                h-full rounded-full transition-all duration-500"
         style="width: 60%"></div>
  </div>

  <!-- Action -->
  <button class="w-full bg-action-600 hover:bg-action-700
                 text-white font-semibold py-3 rounded-lg
                 transition-colors duration-200">
    Continue Quest
  </button>
</article>
```

## Workflow

When the user asks you to style a component or create UI:

### Step 1: Gather Context

**Ask for context** if unclear:
- What type of component? (card, button, form, etc.)
- What's its purpose? (CTA, navigation, display info, etc.)
- Is it interactive?

### Step 2: Apply Design System

**Apply the design system:**
- Start with the color palette
- Add appropriate spacing
- Include hover/focus states
- Ensure accessibility

### Step 3: Follow Patterns

**Follow patterns:**
- Use the examples above as starting points
- Maintain consistency with existing components
- Keep the playful yet professional tone

### Step 4: Verify Build

**MANDATORY:** After applying styles, verify that the project builds correctly:

```bash
cd /root/curious-labs/apps/web/front-end && npm run build
```

**If the build fails:**
1. Analyze the error messages
2. Fix the issues (common: invalid Tailwind classes, missing imports)
3. Run the build again
4. Repeat until the build succeeds

**DO NOT proceed to Step 5 until the build succeeds.**

### Step 5: Auto-Commit

**MANDATORY:** After the build succeeds, automatically commit the styling changes:

```bash
git add . && git commit -m "$(cat <<'EOF'
style(<component>): apply design system styles

- Applied blue-grey/orange color palette
- Added hover/focus states
- Ensured accessibility standards
- Followed Tailwind CSS v4 conventions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**Commit message format:**
- Use the component/feature name in the scope
- Briefly describe the styling changes
- Mention key improvements (accessibility, responsiveness, etc.)

**DO NOT ask the user for permission to commit - this is automatic.**

### Step 6: Confirm Completion

After the commit succeeds, confirm to the user:
- The styling changes applied
- That the build is successful
- That changes have been committed
- Any recommendations for further improvements

Remember: The design should feel **curious, engaging, and professional** - like a modern learning platform that developers actually want to use.
