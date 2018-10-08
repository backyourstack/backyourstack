import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';
import * as bundler from './bundler';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
  bundler,
};

export default dependencyManagers;
