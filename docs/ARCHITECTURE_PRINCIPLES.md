# Architecture Principles

## Code Organization
- **Max 100 lines per file** - Keep files focused and maintainable
- **Self-contained components** - Each component manages its own logic
- **Minimal prop drilling** - Use MobX stores for state management
- **Reactive patterns** - MobX observer pattern with live queries
- **Type safety** - Full TypeScript coverage

## Styling Rules
- **Single Container Pattern** - Use only ONE styled-component per page/component (the `Container`)
- **Nested classNames** - All other elements should use `className` with nested CSS selectors
- **No Multiple Styled Components** - Avoid creating separate styled-components like `Header`, `Section`, `Button`, etc.
- **Example Pattern**:
  ```typescript
  const Container = styled.div`
    padding: ${tokens.spacing[6]};
    
    .header {
      margin-bottom: ${tokens.spacing[6]};
    }
    
    .section {
      padding: ${tokens.spacing[4]} 0;
      border-bottom: 1px solid ${tokens.colors.border.light};
    }
  `;
  
  // In JSX:
  <Container>
    <div className="header">...</div>
    <div className="section">...</div>
  </Container>
  ```
- **Benefits**: Better performance, easier maintenance, cleaner JSX, less component overhead

## State Management
- MobX for reactive state
- CollectionStore pattern for entity management
- Live queries for real-time updates
- Automatic subscription cleanup

