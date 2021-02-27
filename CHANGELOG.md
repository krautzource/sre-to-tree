# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.5](https://github.com/krautzource/sre-to-tree/compare/v1.3.4...v1.3.5) (2021-02-27)


### Bug Fixes

* **package:** typo in scope ([3efdb75](https://github.com/krautzource/sre-to-tree/commit/3efdb755bfa929ff982d435ff5f33c8769c3c214))

### [1.3.4](https://github.com/krautzource/sre-to-tree/compare/v1.3.3...v1.3.4) (2021-02-27)


### Bug Fixes

* improve handling of unexpected input ([0280400](https://github.com/krautzource/sre-to-tree/commit/0280400e791a09c7f19ff6794f6315ddb80630a7)), closes [#14](https://github.com/krautzource/sre-to-tree/issues/14)
* remove data-treewalker attribute ([dabbfcc](https://github.com/krautzource/sre-to-tree/commit/dabbfcc3ad3dae74fd1edfe58c2d7f4f1464b2fc)), closes [#17](https://github.com/krautzource/sre-to-tree/issues/17)
* remove special treatment of a, image, *[role] ([806ac9a](https://github.com/krautzource/sre-to-tree/commit/806ac9a9235b6f446bdbc7a41d67fdbbf292324d)), closes [#13](https://github.com/krautzource/sre-to-tree/issues/13)
* remove tabindex ([94d3d7b](https://github.com/krautzource/sre-to-tree/commit/94d3d7b62163d78388a8d9c4cf6656f92f853249)), closes [#16](https://github.com/krautzource/sre-to-tree/issues/16)

### [1.3.3](https://github.com/krautzource/sre-to-tree/compare/v1.3.2...v1.3.3) (2021-02-02)


### Bug Fixes

* rewrite children that are not descendants ([4e834e4](https://github.com/krautzource/sre-to-tree/commit/4e834e40716dd520752f714176dbc90b61c07e5d)), closes [#10](https://github.com/krautzource/sre-to-tree/issues/10)

### [1.3.2](https://github.com/krautzource/sre-to-tree/compare/v1.3.1...v1.3.2) (2021-02-01)


### Bug Fixes

* remove extraneous logging ([e198df4](https://github.com/krautzource/sre-to-tree/commit/e198df402843f2de611d4ee346e846a020f1677e))

### [1.3.1](https://github.com/krautzource/sre-to-tree/compare/v1.3.0...v1.3.1) (2021-01-29)


### Bug Fixes

* preserve pre-existing IDs ([542801f](https://github.com/krautzource/sre-to-tree/commit/542801fdfa51e0f81da147357ce9aa1eb6f4af39)), closes [#11](https://github.com/krautzource/sre-to-tree/issues/11)

## [1.3.0](https://github.com/krautzource/sre-to-tree/compare/v1.2.0...v1.3.0) (2020-11-18)


### Features

* support braille labels ([178d6d0](https://github.com/krautzource/sre-to-tree/commit/178d6d051942a14ade2f99c76f152f7d68f1d128)), closes [#8](https://github.com/krautzource/sre-to-tree/issues/8)

## [1.2.0](https://github.com/krautzource/sre-to-tree/compare/v1.1.1...v1.2.0) (2020-10-13)


### Features

* add aria-level, -posinset, -setsize ([65b5f16](https://github.com/krautzource/sre-to-tree/commit/65b5f167b2f59d5f8bddcc8196c8fac8b70ba960)), closes [#7](https://github.com/krautzource/sre-to-tree/issues/7)

### [1.1.1](https://github.com/krautzource/sre-to-tree/compare/v1.1.0...v1.1.1) (2020-10-03)


### Bug Fixes

* avoid throwing when no SRE markup ([7063588](https://github.com/krautzource/sre-to-tree/commit/7063588aeb19c457c93d884b1f44b8e3c88bb698)), closes [#3](https://github.com/krautzource/sre-to-tree/issues/3)
* **package:** add jsdom to dev-dependencies ([62fe911](https://github.com/krautzource/sre-to-tree/commit/62fe911cdcbb3fdde4f488a32c36d5704c25a44f)), closes [#5](https://github.com/krautzource/sre-to-tree/issues/5)

## [1.1.0](https://github.com/krautzource/sre-to-tree/compare/v1.0.0...v1.1.0) (2020-09-28)


### Features

* add test framework ([ad0f750](https://github.com/krautzource/sre-to-tree/commit/ad0f7509a8c8c51e1200546ba183210a11960247)), closes [#4](https://github.com/krautzource/sre-to-tree/issues/4)


### Bug Fixes

* **rewrite:** move core attribs to root ([1c8d61c](https://github.com/krautzource/sre-to-tree/commit/1c8d61c6382bb852cfc80d79e563e9413908f3e7)), closes [#2](https://github.com/krautzource/sre-to-tree/issues/2)
* **rewriteNode:** include hash in warning ([99b1fcf](https://github.com/krautzource/sre-to-tree/commit/99b1fcfa621d91ee1a3992c73afb7068d7f7556d)), closes [#1](https://github.com/krautzource/sre-to-tree/issues/1)

## 1.0.0 (2020-09-26)


### Features

* **package:** automatic release with standard-version ([de5d2b5](https://github.com/krautzource/sre-to-tree/commit/de5d2b57a5579f187dfde992a77b2ba67c3e61bd))
* add original code from aria-tree-walker ([3ae6797](https://github.com/krautzource/sre-to-tree/commit/3ae679790342576b67a7adf649fb65caec71faa3))


### Bug Fixes

* **rewriteNode:** warn and return when node is falsy ([cc7d79f](https://github.com/krautzource/sre-to-tree/commit/cc7d79f96985e5a928d5f2b7c06705a896c8e7f0))
* simplify selector for skeletonNode ([38fcc7b](https://github.com/krautzource/sre-to-tree/commit/38fcc7bd1ab6d2dce17831bb086172f9f0018632))
