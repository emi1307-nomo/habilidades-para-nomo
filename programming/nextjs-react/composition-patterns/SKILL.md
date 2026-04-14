---
name: composition-patterns
description: React composition patterns from Vercel (95K installs) — compound components, avoiding boolean prop proliferation, lifting state, children-based composition, React 19 use() hook. Use when building reusable components or refactoring prop-heavy components.
argument-hint: "[component to refactor or build]"
metadata:
  source: vercel-labs/agent-skills
  installs: 95000
  version: "1.0.0"
---

# React Composition Patterns (Vercel)

Build scalable React components through composition, not prop proliferation.

## Core Principle

> "Avoid boolean prop proliferation by using compound components, lifting state, and composing internals."

## Compound Components

```tsx
// ❌ Boolean prop proliferation
<Card
  showHeader
  showFooter
  showAvatar
  isCollapsible
  hasActions
  primaryAction="Edit"
  secondaryAction="Delete"
/>

// ✅ Compound components — compose what you need
<Card>
  <Card.Header>
    <Card.Avatar src={user.image} />
    <Card.Title>{user.name}</Card.Title>
  </Card.Header>
  <Card.Body>{children}</Card.Body>
  <Card.Footer>
    <Card.Actions>
      <Button variant="ghost">Delete</Button>
      <Button>Edit</Button>
    </Card.Actions>
  </Card.Footer>
</Card>

// Implementation
const CardContext = createContext<CardContextType | null>(null)

function Card({ children, className }: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <CardContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className={cn("rounded-xl border bg-card", className)}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3 p-4 border-b">{children}</div>
}

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>
}

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t">{children}</div>
}
```

## Children-Based Composition

```tsx
// ❌ Configuration through props
<Modal
  title="Confirm Delete"
  body="Are you sure?"
  primaryButtonText="Delete"
  primaryButtonVariant="destructive"
  secondaryButtonText="Cancel"
  onPrimary={handleDelete}
  onSecondary={handleClose}
/>

// ✅ Children-based — flexible and extensible
<Modal onClose={handleClose}>
  <Modal.Title>Confirm Delete</Modal.Title>
  <Modal.Description>Are you sure? This action cannot be undone.</Modal.Description>
  <Modal.Footer>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
  </Modal.Footer>
</Modal>
```

## Explicit Variants Over Booleans

```tsx
// ❌ Boolean flags that can conflict
<Button primary secondary large disabled loading />

// ✅ Explicit variants with TypeScript enforcement
type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean  // ok — single boolean with clear meaning
  disabled?: boolean
}

<Button variant="destructive" size="lg">Delete Order</Button>
<Button variant="ghost" size="sm" isLoading={isPending}>Save</Button>
```

## Lifting State Correctly

```tsx
// ❌ Duplicated state — two sources of truth
function Parent() {
  const [tab, setTab] = useState("orders")
  return (
    <>
      <TabBar activeTab={tab} onTabChange={setTab} />
      <TabContent activeTab={tab} /> {/* ← has its own internal tab state too */}
    </>
  )
}

// ✅ Single source of truth — lift to lowest common ancestor
function Parent() {
  const [tab, setTab] = useState<"orders" | "menu" | "reports">("orders")
  return (
    <>
      <TabBar activeTab={tab} onTabChange={setTab} />
      <TabContent tab={tab} />
    </>
  )
}

// ✅ But don't lift too high — keep state local when only one component needs it
function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false) // local — fine!
  return (
    <div>
      <button onClick={() => setIsExpanded(e => !e)}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      {isExpanded && <OrderDetails order={order} />}
    </div>
  )
}
```

## React 19: use() Hook

```tsx
// ✅ use() — consume promises and context in render
import { use, Suspense } from "react"

function OrderDetails({ ordersPromise }: { ordersPromise: Promise<Order[]> }) {
  const orders = use(ordersPromise) // suspends until resolved
  return <ul>{orders.map(o => <li key={o.id}>{o.status}</li>)}</ul>
}

// In parent — pass promise down without await
export default function Page() {
  const ordersPromise = db.order.findMany() // start fetching, don't await
  return (
    <Suspense fallback={<Skeleton />}>
      <OrderDetails ordersPromise={ordersPromise} />
    </Suspense>
  )
}

// ✅ use() with context — can be called conditionally (unlike useContext)
function ThemedButton() {
  const theme = use(ThemeContext) // works inside conditionals too
  return <button className={theme.primary}>Click</button>
}
```

## Render Props for Logic Sharing

```tsx
// ✅ Share stateful logic without HOC complexity
function DataFetcher<T>({
  fetcher,
  children,
}: {
  fetcher: () => Promise<T>
  children: (data: T | null, isLoading: boolean) => React.ReactNode
}) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetcher().then(setData).finally(() => setIsLoading(false))
  }, [fetcher])

  return <>{children(data, isLoading)}</>
}

// Usage
<DataFetcher fetcher={() => getOrders(restaurantId)}>
  {(orders, isLoading) => isLoading ? <Skeleton /> : <OrderList orders={orders!} />}
</DataFetcher>
```
