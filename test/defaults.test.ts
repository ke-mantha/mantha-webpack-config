import { defaultPackageName, defaultPackage, emptyPackage } from "../src/defaults";

describe('defaults', () => {
  it('calls defaultPackageName method', () => {
    const name = defaultPackageName();

    expect(name).toBeUndefined();
  });

  it('calls defaultPackage method', () => {
    const dp = defaultPackage();

    expect(dp).toBeUndefined();
  });

  it('gets emptyPackage', () => {
    const ep = emptyPackage;

    expect(ep).toHaveProperty('webpackConfigurationFactory');
    expect(ep.webpackConfigurationFactory).toBeInstanceOf(Function);

    const emptyWebpackConfiguration = ep.webpackConfigurationFactory('development');

    expect(emptyWebpackConfiguration).toBeUndefined();
  });
});
