import { DynamicFormsModule } from './dynamic-forms.module';

describe('DynamicFormsModule', () => {
  let dynamicFormsModule: DynamicFormsModule;

  beforeEach(() => {
    dynamicFormsModule = new DynamicFormsModule();
  });

  it('should create an instance', () => {
    expect(dynamicFormsModule).toBeTruthy();
  });
});
