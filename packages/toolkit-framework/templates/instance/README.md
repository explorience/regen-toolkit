# templates/instance/

Fill-in markdown forms for standing up an instance. Each maps to a master-doc
**Appendix** and to a framework **schema** — fill the form, transcribe to YAML,
then `node src/cli.mjs validate <schema> <file>`.

| template | master-doc | schema | object |
|---|---|---|---|
| `source-system-card.md` | Appendix A | `source-system` (K2) | a peer knowledge environment |
| `resource-registry-entry.md` | Appendix B | `resource` | a found resource, with provenance |
| `deep-intake.md` | Appendix C | (capture-and-route skill) | one input → many typed objects |
| `option-entry.md` | Appendix D | `option-entry` | a reusable component |
| `deployment.md` | Appendix E | `deployment` | a specified, valid-only-if-visible config |
| `implementation-memory.md` | Appendix F | `implementation-record` | what actually happened |
| `social-signal-scan.md` | Appendix G | `signal` | a discovery / learning lead |
| `glossary.md` | Appendix H | — | instance glossary starter |

See also: populated framework glossary at [`docs/GLOSSARY.md`](../../docs/GLOSSARY.md),
validating examples at [`examples/`](../../examples/).
