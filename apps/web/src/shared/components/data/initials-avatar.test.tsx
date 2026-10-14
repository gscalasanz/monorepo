import { render, screen } from '@testing-library/react';

import { InitialsAvatar } from '@/shared/components/data';

describe('<InitialsAvatar>', () => {
  it('muestra las iniciales y es decorativo (el nombre va en texto al lado)', () => {
    render(<InitialsAvatar name="Lucía Paz" />);
    const avatar = screen.getByText('LP');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
  });

  it('tamaño grande usa el tono de marca', () => {
    render(<InitialsAvatar name="Valentina Ríos" size="lg" />);
    expect(screen.getByText('VR').className).toContain('bg-brand-soft');
  });
});
