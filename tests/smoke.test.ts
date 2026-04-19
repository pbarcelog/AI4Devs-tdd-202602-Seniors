describe('Jest with ts-jest', () => {
  it('runs TypeScript tests from the tests/ folder', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(sum(1, 1)).toBe(2);
  });
});
