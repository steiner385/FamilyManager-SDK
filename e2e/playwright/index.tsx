import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';
import React from 'react';
import '../../src/index.css';

beforeMount(async () => {
  // Add any global setup needed before mounting components
});

afterMount(async () => {
  // Add any cleanup needed after component tests
});
