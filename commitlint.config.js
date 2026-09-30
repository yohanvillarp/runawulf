export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature or capability
        'fix',      // Bug fix
        'sec',      // Security invariant fix or hardening
        'refactor', // Code restructuring without changing behavior
        'docs',     // Documentation or architecture specs
        'chore',    // Tooling, dependencies, or maintenance
        'style',    // Formatting, missing semicolons, etc.
        'test',     // Adding or updating tests
        'perf',     // Performance improvement
        'ci',       // CI/CD workflow changes
        'revert',   // Reverting previous commits
      ],
    ],
    'subject-case': [0],
  },
};
