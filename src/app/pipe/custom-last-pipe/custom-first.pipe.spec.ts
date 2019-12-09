import { CustomLastPipe } from './custom-first.pipe';

describe('CustomFirstPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomLastPipe();
    expect(pipe).toBeTruthy();
  });
});
