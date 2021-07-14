import { ShowFirstNPipe } from './show-first-n.pipe';

describe('ShowFirstNPipe', () => {
  it('create an instance', () => {
    const pipe = new ShowFirstNPipe();
    expect(pipe).toBeTruthy();
  });
});
