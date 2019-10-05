import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';
import * as bundler from './bundler';
import * as requirements from './requirements';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
  bundler,
  requirements,
};

export default dependencyManagers;
