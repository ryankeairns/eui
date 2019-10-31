import React from 'react';

import {
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '../../../../src/components';

import { motion } from 'framer-motion';

const icons = ['Beats', 'Cloud', 'Logging', 'Kibana'];

const containerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
}

const cardNodes = icons.map(function(item, index) {
  return (
    <EuiFlexItem key={index}>
      <motion.div variants={containerItem}>
        <EuiCard
          icon={<EuiIcon size="xxl" type={`logo${item}`} />}
          title={`Elastic ${item}`}
          isDisabled={item === 'Kibana' ? true : false}
          description="Example of a card's description. Stick to one or two sentences."
          onClick={() => window.alert('Card clicked')}
        />
      </motion.div>
    </EuiFlexItem>
  );
});

export default () => <EuiFlexGroup gutterSize="l">{cardNodes}</EuiFlexGroup>;
