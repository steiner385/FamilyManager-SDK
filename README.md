# FamilyManager SDK

The FamilyManager SDK provides shared components, utilities, and testing infrastructure for FamilyManager modules.

## Installation

```bash
npm install @familymanager/sdk
```

## Components

### Common Components

```typescript
import { 
  LoadingSpinner,
  LoadingSkeleton,
  Modal,
  ErrorBoundary 
} from '@familymanager/sdk';

// Loading states
<LoadingSpinner />
<LoadingSkeleton />

// Modal dialogs
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Example Modal"
>
  Modal content
</Modal>

// Error handling
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Visualization Components

#### LineChart

For displaying time series data:

```typescript
import { LineChart } from '@familymanager/sdk';

const data = [
  { timestamp: new Date('2024-01-01').getTime(), value: 10 },
  { timestamp: new Date('2024-01-02').getTime(), value: 20 },
  { timestamp: new Date('2024-01-03').getTime(), value: 15 }
];

<LineChart
  data={data}
  size={{ width: 600, height: 400 }}
  styles={{
    line: { stroke: '#2563eb', strokeWidth: 2 },
    point: { fill: '#1d4ed8', radius: 4 },
    axis: { stroke: '#94a3b8', strokeWidth: 1 }
  }}
  formatters={{
    timestamp: (ts) => new Date(ts).toLocaleDateString(),
    value: (val) => `$${val}`
  }}
/>
```

#### MetricsCard

For displaying KPI metrics:

```typescript
import { MetricsCard } from '@familymanager/sdk';

<MetricsCard
  title="Total Revenue"
  value={1234.56}
  trend="up"
  change={15.2}
  timeframe="vs last month"
  formatters={{
    value: (val) => `$${val.toFixed(2)}`,
    change: (val) => `${val > 0 ? '↑' : '↓'}${Math.abs(val)}%`
  }}
  styles={{
    card: 'bg-white rounded-lg shadow-sm p-4',
    title: 'text-gray-600 text-sm font-medium',
    value: 'text-gray-900 text-2xl font-semibold',
    change: 'text-green-500',
    timeframe: 'text-gray-500 text-sm'
  }}
/>
```

## Testing Utilities

The SDK provides testing utilities to help write consistent tests across modules:

```typescript
import { 
  render, 
  screen,
  userEvent,
  createModuleTestBed,
  mockEventEmitter,
  createStateTestBed,
  createMockData
} from '@familymanager/sdk/testing';

// Component testing
describe('Component', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// Module testing
describe('Module', () => {
  const testBed = createModuleTestBed('my-module');
  
  it('initializes correctly', async () => {
    await testBed.initialize();
    expect(testBed.getState()).toBeDefined();
  });
});

// State testing
describe('State', () => {
  const stateBed = createStateTestBed('my-module');
  
  it('updates state', () => {
    const { dispatch, getState } = stateBed;
    dispatch(action);
    expect(getState()).toEqual(expected);
  });
});

// Event testing
describe('Events', () => {
  const emitter = mockEventEmitter();
  
  it('handles events', () => {
    const handler = jest.fn();
    emitter.on('event', handler);
    emitter.emit('event', data);
    expect(handler).toHaveBeenCalled();
  });
});

// Mock data
const mockData = {
  timestamp: createMockData.timestamp('2024-01-01'),
  user: createMockData.user({ name: 'Test User' }),
  event: createMockData.event({ title: 'Test Event' })
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Setup

Create a `.env` file with the following required variables:

```bash
REACT_APP_API_URL=your_api_url_here
```

**Important:** Never commit .env files containing secrets or credentials. The repository includes only .env.example as a template.

## Security

### Required Environment Variables
- `REACT_APP_API_URL`: Base URL for API endpoints
- `REACT_APP_AUTH_DOMAIN`: Authentication provider domain
- `REACT_APP_AUTH_CLIENT_ID`: OAuth client ID
- `REACT_APP_AUTH_AUDIENCE`: API audience identifier

### Obtaining Credentials
1. Authentication credentials can be obtained from your organization's auth provider
2. API credentials should be requested through the internal developer portal
3. Contact security@familymanager.com for access to development environments

### Security Best Practices
- Never commit .env files or security credentials
- Use environment-specific .env files (.env.development, .env.staging, etc.)
- Rotate credentials regularly
- Enable 2FA for all development accounts
- Follow the principle of least privilege when requesting access

### Security Issues & Incident Response
For security concerns or vulnerability reports:
1. Email: security@familymanager.com
2. Emergency hotline: +1-XXX-XXX-XXXX (24/7 Security Response Team)
3. Bug bounty program: https://bugbounty.familymanager.com

#### Emergency Response Procedures
1. **Critical Security Incidents:**
   - Call emergency hotline immediately
   - Email security@familymanager.com with [CRITICAL] prefix
   - Follow incident escalation matrix in internal wiki

2. **Credential Compromise:**
   - Immediately notify security team
   - Begin credential rotation procedure
   - Document affected systems
   - Monitor for suspicious activity

3. **Security Incident Updates:**
   - Status updates every 2 hours during active incidents
   - Post-incident report within 24 hours
   - Root cause analysis within 72 hours

## License

This project is licensed under the MIT License - see the LICENSE file for details.
