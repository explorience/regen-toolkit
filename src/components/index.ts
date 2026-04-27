// UI component stubs

// Placeholder for future React/CLI component implementations

export interface ComponentProps {
  className?: string;
}

export interface ButtonProps extends ComponentProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export class Button {
  constructor(props: ButtonProps) {
    // Stub implementation
  }
}

export class Card {
  constructor(props: ComponentProps) {
    // Stub implementation
  }
}
