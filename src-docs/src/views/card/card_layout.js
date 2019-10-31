import React from 'react';

import {
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '../../../../src/components';

import { motion } from 'framer-motion';

const containerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
}

export default () => (
  <EuiFlexGroup gutterSize="l">
    <EuiFlexItem>
      <motion.div variants={containerItem}>
        <EuiCard
          layout="horizontal"
          icon={<EuiIcon size="xxl" type={'logoBeats'} />}
          title={'Elastic Beats'}
          description="Example of a card's description. Stick to one or two sentences."
          onClick={() => window.alert('Card clicked')}
        />
      </motion.div>
    </EuiFlexItem>
    <EuiFlexItem>
      <motion.div variants={containerItem}>
        <EuiCard
          layout="horizontal"
          icon={<EuiIcon size="xxl" type={'logoCloud'} />}
          title={'Elastic Cloud'}
          description="Example of a card's description. Stick to one or two sentences."
          onClick={() => window.alert('Card clicked')}
        />
      </motion.div>
    </EuiFlexItem>
    <EuiFlexItem>
      <motion.div variants={containerItem}>
        <EuiCard
          layout="horizontal"
          title={'No icon example'}
          description="Example of a card's description. Stick to one or two sentences."
          onClick={() => window.alert('Card clicked')}
        />
      </motion.div>
    </EuiFlexItem>
  </EuiFlexGroup>
);
