import baseConfig from '@scout/config/eslint/base';
import { packagesPreset } from '@scout/config/eslint/monorepo-boundaries';
import { noNewDatePresets } from '@scout/config/eslint/no-new-date';

export default [...baseConfig, ...noNewDatePresets.packages, packagesPreset];
