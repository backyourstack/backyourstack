import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';
import * as bundler from './bundler';
import * as pypi from './pypi';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
  bundler,
  pypi,
};

export default dependencyManagers;
