import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/common/Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
    max: {
      control: 'number',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showValue: {
      control: 'boolean',
    },
    valuePosition: {
      control: 'radio',
      options: ['inside', 'outside'],
    },
    label: {
      control: 'text',
    },
    animated: {
      control: 'boolean',
    },
    striped: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Upload Progress',
  },
};

export const WithValue: Story = {
  args: {
    value: 45,
    showValue: true,
  },
};

export const WithValueInside: Story = {
  args: {
    value: 85,
    showValue: true,
    valuePosition: 'inside',
    size: 'lg',
  },
};

export const Variants: Story = {
  args: {
    value: 80,
  },
  render: () => (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <Progress value={80} variant="primary" label="Primary" />
      <Progress value={80} variant="success" label="Success" />
      <Progress value={80} variant="warning" label="Warning" />
      <Progress value={80} variant="danger" label="Danger" />
      <Progress value={80} variant="info" label="Info" />
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    value: 70,
  },
  render: () => (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <Progress
        value={70}
        size="sm"
        label="Small"
        showValue
        valuePosition="outside"
      />
      <Progress
        value={70}
        size="md"
        label="Medium"
        showValue
        valuePosition="outside"
      />
      <Progress
        value={70}
        size="lg"
        label="Large"
        showValue
        valuePosition="inside"
      />
    </div>
  ),
};

export const Striped: Story = {
  args: {
    value: 60,
  },
  render: () => (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <Progress value={60} striped label="Striped Progress" />
      <Progress value={60} striped animated label="Striped Animated Progress" />
    </div>
  ),
};

// Example of an animated progress that updates over time
export const AnimatedProgress: Story = {
  args: {
    value: 0,
  },
  render: () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="min-w-[300px]">
        <Progress
          value={progress}
          animated
          striped
          label="Loading..."
          showValue
          valuePosition="outside"
        />
      </div>
    );
  },
};

// Example of multiple progress bars in a real-world context
export const UploadExample: Story = {
  args: {
    value: 0,
  },
  render: () => (
    <div className="p-6 bg-white rounded-lg shadow-sm min-w-[400px]">
      <h3 className="text-lg font-medium text-gray-900 mb-4">File Uploads</h3>
      <div className="space-y-4">
        <Progress
          value={100}
          variant="success"
          label="document.pdf"
          showValue
          size="sm"
        />
        <Progress
          value={85}
          variant="primary"
          label="presentation.pptx"
          showValue
          animated
          striped
          size="sm"
        />
        <Progress
          value={45}
          variant="warning"
          label="video.mp4"
          showValue
          animated
          striped
          size="sm"
        />
        <Progress
          value={0}
          variant="info"
          label="archive.zip"
          showValue
          size="sm"
        />
      </div>
    </div>
  ),
};

// Example of a custom max value
export const CustomMaxValue: Story = {
  args: {
    value: 150,
  },
  render: () => (
    <div className="space-y-4 min-w-[300px]">
      <Progress
        value={150}
        max={200}
        label="Custom max (200)"
        showValue
        valuePosition="outside"
      />
      <Progress
        value={750}
        max={1000}
        label="Download progress (MB)"
        showValue
        valuePosition="outside"
      />
    </div>
  ),
};
