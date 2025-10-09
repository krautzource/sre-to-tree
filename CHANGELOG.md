# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [4.0.2](https://github.com/krautzource/sre-to-tree/compare/v4.0.1...v4.0.2) (2025-10-09)


### Bug Fixes

* complex "wrapping links" ([92ac600](https://github.com/krautzource/sre-to-tree/commit/92ac60063282f59c5a341e9224f7eb70aab81d33)), closes [#43](https://github.com/krautzource/sre-to-tree/issues/43)
* removing svg img role in edge cases ([a75bced](https://github.com/krautzource/sre-to-tree/commit/a75bcedc209b1e06882e77916f80b435f20fc6e3)), closes [#44](https://github.com/krautzource/sre-to-tree/issues/44)

## [4.0.1](https://github.com/krautzource/sre-to-tree/compare/v4.0.0...v4.0.1) (2025-10-02)


### Bug Fixes

* presentational elements should not have labels ([9770455](https://github.com/krautzource/sre-to-tree/commit/97704551ea39ae53ef91edd52b96c87b28e61936)), closes [#42](https://github.com/krautzource/sre-to-tree/issues/42)

## [4.0.0](https://github.com/krautzource/sre-to-tree/compare/v3.0.1...v4.0.0) (2025-10-02)


### ⚠ BREAKING CHANGES

* Switch to ESM; switch main to named export, "sre2tree".

### Features

* support non-tree edge cases ([0d64a93](https://github.com/krautzource/sre-to-tree/commit/0d64a9384bcb2f4a5e028cf69c0f34d8bb4f8566)), closes [#41](https://github.com/krautzource/sre-to-tree/issues/41)
* switch to ESM ([4ecf8f7](https://github.com/krautzource/sre-to-tree/commit/4ecf8f7f29ac0c7f0368b98651a61bd3941a75bd)), closes [#38](https://github.com/krautzource/sre-to-tree/issues/38)


### Bug Fixes

* **lib.js:** better no-op warning ([5a75367](https://github.com/krautzource/sre-to-tree/commit/5a75367fc9949b3b734b516049fd5cab860a3c8e))
* **lib.js:** better no-op warning ([d4e0ee1](https://github.com/krautzource/sre-to-tree/commit/d4e0ee1f9f7dd39954c14c335330431785b00cd2))
* **package:** switch to commit-and-tag-version ([a910153](https://github.com/krautzource/sre-to-tree/commit/a910153cb44102d1f340ec840145490d8148eb3b))
* **package:** upgrade mathjax & sre ([28fae1c](https://github.com/krautzource/sre-to-tree/commit/28fae1c59b447c5ca97242d71329ee567f2180e7))
* **tex2svg:** reset SRE modality ([5968e98](https://github.com/krautzource/sre-to-tree/commit/5968e98a3cfcd258ed0e65886de3128a0a80b284)), closes [#39](https://github.com/krautzource/sre-to-tree/issues/39)

### [3.0.1](https://github.com/krautzource/sre-to-tree/compare/v3.0.0...v3.0.1) (2023-11-09)


### Bug Fixes

* selection of "semantic root" ([25bf789](https://github.com/krautzource/sre-to-tree/commit/25bf789e6e483d5f48a8c8117b69b509e405cb04)), closes [Speech-Rule-Engine/speech-rule-engine#729](https://github.com/Speech-Rule-Engine/speech-rule-engine/issues/729) [#37](https://github.com/krautzource/sre-to-tree/issues/37)
* upgrade mahtjax, sre ([0eee365](https://github.com/krautzource/sre-to-tree/commit/0eee365e7cb01d9b23c819b55875ce5255dd7620))

## [3.0.0](https://github.com/krautzource/sre-to-tree/compare/v2.0.2...v3.0.0) (2022-09-22)


### ⚠ BREAKING CHANGES

* Removes data-href, makes anchors active.

### Features

* revise anchor handling ([3f60216](https://github.com/krautzource/sre-to-tree/commit/3f60216669189445a1ed4730ef4a931cd330330a)), closes [#33](https://github.com/krautzource/sre-to-tree/issues/33)


### Bug Fixes

* tree root should not have level ([281f86c](https://github.com/krautzource/sre-to-tree/commit/281f86ca0ec75f12349324d657cfce1474a86dca)), closes [#30](https://github.com/krautzource/sre-to-tree/issues/30)

### [2.0.2](https://github.com/krautzource/sre-to-tree/compare/v2.0.1...v2.0.2) (2021-11-11)


### Bug Fixes

* add aria-hidden to all treeitems ([5ef4cb5](https://github.com/krautzource/sre-to-tree/commit/5ef4cb554e9fc4a9317a132ec90a2901b739c033)), closes [#27](https://github.com/krautzource/sre-to-tree/issues/27)
* prevent empty aria-label ([f4f1182](https://github.com/krautzource/sre-to-tree/commit/f4f11821d7d56f7b4746434d9de2254e93e910d1)), closes [#26](https://github.com/krautzource/sre-to-tree/issues/26)

### [2.0.1](https://github.com/krautzource/sre-to-tree/compare/v2.0.0...v2.0.1) (2021-04-12)


### Bug Fixes

* select all descendantNodes ([13fd676](https://github.com/krautzource/sre-to-tree/commit/13fd67600d35ad9dbb49e4b4b8dcba66aef2e4f9)), closes [#21](https://github.com/krautzource/sre-to-tree/issues/21)

## [2.0.0](https://github.com/krautzource/sre-to-tree/compare/v1.4.0...v2.0.0) (2021-03-18)


### ⚠ BREAKING CHANGES

* no longer uses aria-owns+id attributes to document tree but data-owns+data-owns-id instead.

### Features

* switch from aria-owns to data-owns ([274bc44](https://github.com/krautzource/sre-to-tree/commit/274bc447bc4456f344bdef3df2d81d2a0d0f895b)), closes [#20](https://github.com/krautzource/sre-to-tree/issues/20)

## [1.4.0](https://github.com/krautzource/sre-to-tree/compare/v1.3.5...v1.4.0) (2021-03-13)


### Features

* "reinstate" anchors ([eca1914](https://github.com/krautzource/sre-to-tree/commit/eca19148b2f1bb059739414aa017bf78dd6fcba9)), closes [#19](https://github.com/krautzource/sre-to-tree/issues/19)
* improve anchors ([e2afba8](https://github.com/krautzource/sre-to-tree/commit/e2afba8ede649edf35080c0973ff42ba4133e229)), closes [#22](https://github.com/krautzource/sre-to-tree/issues/22)

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
