# Change Log

## [Unreleased](https://github.com/haganbmj/obs-websocket-js/tree/HEAD)

[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.6.0...HEAD)

**Implemented enhancements:**

- \[API\] Expose addEvent and addRequest methods [\#47](https://github.com/haganbmj/obs-websocket-js/issues/47)
- \[API\] Strengthen Address Parsing [\#21](https://github.com/haganbmj/obs-websocket-js/issues/21)

**Closed issues:**

- \[Docs\] Determine if Generated Docs are Still Relevant [\#20](https://github.com/haganbmj/obs-websocket-js/issues/20)

## [v0.6.0](https://github.com/haganbmj/obs-websocket-js/tree/v0.6.0) (2017-05-26)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.5.3...v0.6.0)

## [v0.5.3](https://github.com/haganbmj/obs-websocket-js/tree/v0.5.3) (2017-05-05)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.5.2...v0.5.3)

**Closed issues:**

- Implement GetCurrentRTMPSettings [\#48](https://github.com/haganbmj/obs-websocket-js/issues/48)

## [v0.5.2](https://github.com/haganbmj/obs-websocket-js/tree/v0.5.2) (2017-05-03)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.5.1...v0.5.2)

**Implemented enhancements:**

- \[API\] Convert AuthHashing from a Class to a Function [\#44](https://github.com/haganbmj/obs-websocket-js/issues/44)
- \[API\] Standardize internal emits [\#42](https://github.com/haganbmj/obs-websocket-js/issues/42)

**Fixed bugs:**

- \[API\] Binding multiple events results in duplicate callbacks [\#46](https://github.com/haganbmj/obs-websocket-js/issues/46)

**Merged pull requests:**

- \[CI\] Set up Coveralls [\#45](https://github.com/haganbmj/obs-websocket-js/pull/45) ([haganbmj](https://github.com/haganbmj))

## [v0.5.1](https://github.com/haganbmj/obs-websocket-js/tree/v0.5.1) (2017-04-29)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.5.0...v0.5.1)

**Implemented enhancements:**

- \[API\] Revise send method [\#41](https://github.com/haganbmj/obs-websocket-js/pull/41) ([haganbmj](https://github.com/haganbmj))

**Closed issues:**

- Update Bower Release [\#43](https://github.com/haganbmj/obs-websocket-js/issues/43)

## [v0.5.0](https://github.com/haganbmj/obs-websocket-js/tree/v0.5.0) (2017-04-27)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.4.0...v0.5.0)

**Implemented enhancements:**

- \[API\] Refactor \#connect\(\) to accept both an address and password [\#29](https://github.com/haganbmj/obs-websocket-js/issues/29)
- \[Style\] Consider using ESlint instead of jshint [\#27](https://github.com/haganbmj/obs-websocket-js/issues/27)
- \[Test\] Basic Unit Testing [\#22](https://github.com/haganbmj/obs-websocket-js/issues/22)
- \[Docs\] Update Readme and Code Samples [\#19](https://github.com/haganbmj/obs-websocket-js/issues/19)

**Fixed bugs:**

- \[API\] Rejects when no Socket Connection Exists [\#34](https://github.com/haganbmj/obs-websocket-js/issues/34)
- Fix webpack distributable [\#38](https://github.com/haganbmj/obs-websocket-js/pull/38) ([haganbmj](https://github.com/haganbmj))
- \[API\] Fix errors caused when .disconnect is called at the wrong time [\#37](https://github.com/haganbmj/obs-websocket-js/pull/37) ([Lange](https://github.com/Lange))

**Closed issues:**

- \[Log\] Silence logging by default [\#32](https://github.com/haganbmj/obs-websocket-js/issues/32)
- \[CI\] Update Travis Scripts to Ensure updated Distributable [\#24](https://github.com/haganbmj/obs-websocket-js/issues/24)

**Merged pull requests:**

- Small README fixes [\#39](https://github.com/haganbmj/obs-websocket-js/pull/39) ([Lange](https://github.com/Lange))
- \[Tests\] Add basic connection & authentication tests [\#36](https://github.com/haganbmj/obs-websocket-js/pull/36) ([Lange](https://github.com/Lange))
- Several fixes and refactors [\#33](https://github.com/haganbmj/obs-websocket-js/pull/33) ([Lange](https://github.com/Lange))
- \[Docs\] Add agdq17-layouts to projects list [\#31](https://github.com/haganbmj/obs-websocket-js/pull/31) ([Lange](https://github.com/Lange))
- \[Style\] Adopt eslint-config-xo-space/esnext [\#30](https://github.com/haganbmj/obs-websocket-js/pull/30) ([Lange](https://github.com/Lange))
- \[CI\] Update Travis Scripts to Ensure updated Distributable [\#28](https://github.com/haganbmj/obs-websocket-js/pull/28) ([haganbmj](https://github.com/haganbmj))

## [v0.4.0](https://github.com/haganbmj/obs-websocket-js/tree/v0.4.0) (2017-04-23)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.3.3...v0.4.0)

**Implemented enhancements:**

- Implement individual Start and Stop Recording/Streaming methods [\#3](https://github.com/haganbmj/obs-websocket-js/issues/3)
- Update API for obs-websocket 4.0.0 development additions [\#15](https://github.com/haganbmj/obs-websocket-js/issues/15)
- Support ".on\(" style event emissions. [\#14](https://github.com/haganbmj/obs-websocket-js/issues/14)
- \[Build\] Switch to Browserify/Webpack for Builds [\#13](https://github.com/haganbmj/obs-websocket-js/issues/13)
- \[Protocol\] Rewrite with Versioning obs-websocket in Mind [\#12](https://github.com/haganbmj/obs-websocket-js/issues/12)
- \[Protocol\] Implement Set/GetVolume methods [\#11](https://github.com/haganbmj/obs-websocket-js/issues/11)

**Fixed bugs:**

- OBSWebSocket is not a constructor error  [\#17](https://github.com/haganbmj/obs-websocket-js/issues/17)

**Merged pull requests:**

- Rewrite. Fix \#3, Fix \#11, Fix \#12, Fix \#13, Fix \#14, Fix \#15 [\#16](https://github.com/haganbmj/obs-websocket-js/pull/16) ([haganbmj](https://github.com/haganbmj))

## [v0.3.3](https://github.com/haganbmj/obs-websocket-js/tree/v0.3.3) (2017-02-17)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.2.0...v0.3.3)

**Implemented enhancements:**

- Expand documentation to include params and response objects [\#2](https://github.com/haganbmj/obs-websocket-js/issues/2)

**Closed issues:**

- Disconnect function [\#8](https://github.com/haganbmj/obs-websocket-js/issues/8)
- setSourceVisbility not working [\#7](https://github.com/haganbmj/obs-websocket-js/issues/7)
- onSceneListChanged not working [\#5](https://github.com/haganbmj/obs-websocket-js/issues/5)
- Fix Node dependency [\#4](https://github.com/haganbmj/obs-websocket-js/issues/4)

**Merged pull requests:**

- Travis-CI Test + Update .gitignore [\#10](https://github.com/haganbmj/obs-websocket-js/pull/10) ([haganbmj](https://github.com/haganbmj))

## [v0.2.0](https://github.com/haganbmj/obs-websocket-js/tree/v0.2.0) (2016-12-02)
[Full Changelog](https://github.com/haganbmj/obs-websocket-js/compare/v0.1.0...v0.2.0)

## [v0.1.0](https://github.com/haganbmj/obs-websocket-js/tree/v0.1.0) (2016-11-26)
**Implemented enhancements:**

- Marshal callback params to OBSScene and OBSSource objects [\#1](https://github.com/haganbmj/obs-websocket-js/issues/1)



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*