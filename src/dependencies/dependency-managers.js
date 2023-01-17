import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';
import * as bundler from './bundler';
import * as pypi from './pypi';
import * as pub from './pub';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
  bundler,
  pypi,
  pub,
};

export default dependencyManagers;
