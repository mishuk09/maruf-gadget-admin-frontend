import { act, render, screen } from '@testing-library/react';
import Alert from './components/Alert';

describe('Alert', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('hides automatically after 3 seconds', () => {
    render(<Alert name="Saved successfully" type="success" />);

    expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(/saved successfully/i)).not.toBeInTheDocument();
  });
});
