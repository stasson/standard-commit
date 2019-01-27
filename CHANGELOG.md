# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.4.0"></a>
# [1.4.0](https://github.com/stasson/standard-commit/compare/v1.3.0...v1.4.0) (2019-01-27)


### Bug Fixes

* **package:** add missing rxjs dependency ([8586b31](https://github.com/stasson/standard-commit/commit/8586b31))

### Features

* **bin:** run from local if installed ([88db06b](https://github.com/stasson/standard-commit/commit/88db06b))

* **cli:** add update notifier ([9b70c98](https://github.com/stasson/standard-commit/commit/9b70c98))

<a name="1.2.0"></a>
# [1.2.0](https://github.com/stasson/standard-commit/compare/v1.1.0...v1.2.0) (2019-01-19)


### Features

* **lib:** adjust scope suggestion order ([73d38e7](https://github.com/stasson/standard-commit/commit/73d38e7))
* **prompt:** improve scope prompt for suggest ([c395f6d](https://github.com/stasson/standard-commit/commit/c395f6d))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/stasson/standard-commit/compare/v1.0.1...v1.1.0) (2019-01-19)


### Bug Fixes

* scopes config is not applied ([aa70173](https://github.com/stasson/standard-commit/commit/aa70173))
* **lib:** update rules as per latest conventional commit ([e276965](https://github.com/stasson/standard-commit/commit/e276965))


### Features

* **scopes:** add support for monorepo package names ([f4ba3dd](https://github.com/stasson/standard-commit/commit/f4ba3dd))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/stasson/standard-commit/compare/v1.0.0...v1.0.1) (2018-10-27)


### Bug Fixes

* commit lint final status failure ([969835a](https://github.com/stasson/standard-commit/commit/969835a)), closes [#2](https://github.com/stasson/standard-commit/issues/2)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/stasson/standard-commit/compare/v0.10.0...v1.0.0) (2018-09-16)


### Features

* simplify commithook and commitlint ([804ad71](https://github.com/stasson/standard-commit/commit/804ad71))


### BREAKING CHANGES

* standard-commit-lint is now standard-commitlint and standard-commit-msg-hook is now standard-commithook



<a name="0.10.0"></a>
# [0.10.0](https://github.com/stasson/standard-commit/compare/v0.9.1...v0.10.0) (2018-09-16)


### Bug Fixes

* simplify default scopes ([6fc2d54](https://github.com/stasson/standard-commit/commit/6fc2d54))


### Features

* add support for commitlint ([2f10267](https://github.com/stasson/standard-commit/commit/2f10267))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/stasson/standard-commit/compare/v0.9.0...v0.9.1) (2018-09-13)


### Bug Fixes

* wrong cli path ([aade7e9](https://github.com/stasson/standard-commit/commit/aade7e9))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/stasson/standard-commit/compare/v0.8.1...v0.9.0) (2018-09-13)


### Features

* alias should be managed by git ([1c3e954](https://github.com/stasson/standard-commit/commit/1c3e954))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/stasson/standard-commit/compare/v0.8.0...v0.8.1) (2018-09-08)


### Bug Fixes

* help text ([74d1219](https://github.com/stasson/standard-commit/commit/74d1219))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/stasson/standard-commit/compare/v0.7.1...v0.8.0) (2018-09-08)


### Features

* add dedicated promptscope config ([a9c2588](https://github.com/stasson/standard-commit/commit/a9c2588))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/stasson/standard-commit/compare/v0.7.0...v0.7.1) (2018-09-07)


### Bug Fixes

* empty scope throws ([b2b6e74](https://github.com/stasson/standard-commit/commit/b2b6e74))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/stasson/standard-commit/compare/v0.6.1...v0.7.0) (2018-09-06)


### Features

* refine prompt config ([a2a3f8d](https://github.com/stasson/standard-commit/commit/a2a3f8d))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/stasson/standard-commit/compare/v0.6.0...v0.6.1) (2018-09-06)


### Bug Fixes

* new files are missing from scope suggestions ([cca96fa](https://github.com/stasson/standard-commit/commit/cca96fa))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/stasson/standard-commit/compare/v0.5.0...v0.6.0) (2018-09-04)


### Bug Fixes

* scope is badly formated ([52b1438](https://github.com/stasson/standard-commit/commit/52b1438))


### Features

* add edit prompt ([d16fc26](https://github.com/stasson/standard-commit/commit/d16fc26))
* enable types and scopes configuration ([03b9c14](https://github.com/stasson/standard-commit/commit/03b9c14))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/stasson/standard-commit/compare/v0.4.0...v0.5.0) (2018-09-03)


### Bug Fixes

* git-cc is actually a better alias ([651b144](https://github.com/stasson/standard-commit/commit/651b144))


### Features

* add scope config ([50783c3](https://github.com/stasson/standard-commit/commit/50783c3))
* check if can commit before prompt ([8ecc8c7](https://github.com/stasson/standard-commit/commit/8ecc8c7))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/stasson/standard-commit/compare/v0.3.1...v0.4.0) (2018-09-02)


### Bug Fixes

* add missing test commit type ([80bbfcf](https://github.com/stasson/standard-commit/commit/80bbfcf))
* align prompts ([af04c59](https://github.com/stasson/standard-commit/commit/af04c59))


### Features

* add config support ([4739a1f](https://github.com/stasson/standard-commit/commit/4739a1f))
* scope suggestion ([1f35455](https://github.com/stasson/standard-commit/commit/1f35455))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/stasson/standard-commit/compare/v0.3.0...v0.3.1) (2018-09-01)


### Bug Fixes

* remove breaking change extra formated line break ([066ecf2](https://github.com/stasson/standard-commit/commit/066ecf2))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/stasson/standard-commit/compare/v0.2.3...v0.3.0) (2018-09-01)


### Bug Fixes

* set alias to git-sc instead of git-cc ([0d858ef](https://github.com/stasson/standard-commit/commit/0d858ef))


### Features

* add commit message parsing ([af6cb56](https://github.com/stasson/standard-commit/commit/af6cb56))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/stasson/standard-commit/compare/v0.2.2...v0.2.3) (2018-08-31)


### Bug Fixes

* align prompts ([bd7afad](https://github.com/stasson/standard-commit/commit/bd7afad))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/stasson/standard-commit/compare/v0.2.1...v0.2.2) (2018-08-30)


### Bug Fixes

* distribution is missing ./commit.js ([f1f1c03](https://github.com/stasson/standard-commit/commit/f1f1c03))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/stasson/standard-commit/compare/v0.2.0...v0.2.1) (2018-08-30)


### Bug Fixes

* distribution missing files ([377ecb2](https://github.com/stasson/standard-commit/commit/377ecb2))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/stasson/standard-commit/compare/v0.1.0...v0.2.0) (2018-08-30)


### Features

* add cli usage and options ([b020811](https://github.com/stasson/standard-commit/commit/b020811))
* spawn git-commit ([95ca9f9](https://github.com/stasson/standard-commit/commit/95ca9f9))



<a name="0.1.0"></a>
# 0.1.0 (2018-08-29)


### Features

* prompt and format commit message ([224938e](https://github.com/stasson/standard-commit/commit/224938e))
