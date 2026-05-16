# Split-Pay Design System

This design system is built to integrate seamlessly with the MiniPay ecosystem, emphasizing clarity, speed, and trust. It leverages Tailwind CSS and Shadcn UI for a consistent, accessible experience.

## Typography
The system uses **Inter** as the primary typeface. Font scaling is handled via Tailwind classes to ensure responsive and consistent sizing.

| Role | Tailwind Class | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Headline Large** | `text-2xl` | 24px | Bold (700) | Welcome greetings, Page titles |
| **Headline Medium** | `text-lg` | 18px | Semi-Bold (600) | Section headers (e.g., Recent Bills) |
| **Body Large** | `text-sm` | 14px | Medium (500) | Card titles, Primary UI labels |
| **Body Medium** | `text-xs` | 12px | Regular (400) | Subtitles, Secondary descriptions |
| **Label Small** | `text-xs` | 10px | Bold (700) | Status badges, All-caps labels |

## Color Palette
The palette uses CSS variables for semantic mapping, centered around MiniPay Green.

### Core Colors
- **Primary (--primary):** `hsl(158 100% 33%)` (#00A86B) - MiniPay Green. Used for primary actions and brand presence.
- **Background (--background):** `hsl(110 33% 97%)` (#F4FBF3) - Light mint-beige background.
- **Foreground (--foreground):** `hsl(160 5% 10%)` - Dark charcoal-green for high contrast text.
- **Muted Foreground:** `hsl(160 8% 26%)` - Soft gray-green for secondary text.

### Semantic States
- **Success/Paid:** `bg-green-100` with `text-green-600`.
- **Warning/Active:** `bg-orange-100` with `text-orange-600`.
- **Secondary/Callout:** `bg-secondary/30` with dashed borders.

## Layout & Components
- **Roundness:** 
  - Standard cards/buttons: `8px` (`rounded-lg` via `--radius`).
  - Action icons/containers: `12px` (`rounded-xl`).
  - Profile/Avatar: `rounded-full`.
- **Elevation:** Low-profile shadows (`shadow-sm`) for white cards; `shadow-lg shadow-primary/20` for floating primary icons.
- **Spacing:** Built on a `4px` grid. Page layout usually uses `space-y-6` for sections and `p-4` (16px) for inner padding.

## Core Components
- **User Balance Card:** High-contrast display of current balance (cUSD) using the `UserBalance` component.
- **Quick Action Cards:** Large cards with `rounded-xl` primary-colored icons, `bg-primary/5` background, and `primary/20` borders.
- **Recent Activity List:** Vertical stack of cards with status badges and amount displays in cUSD.
- **AI Assistant Callout:** A dashed-border card using `bg-secondary/30` and a pulsing indicator to draw attention to AI features.
- **Navigation:** Fixed bottom bar with icons and clear labels for core app sections.

