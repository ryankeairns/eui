import React from 'react';

import { EuiScreenReaderOnly } from '../../../../src/components/accessibility/screen_reader';
import { EuiCode } from '../../../../src/components/code';
import { EuiText } from '../../../../src/components/text';
import { EuiTitle } from '../../../../src/components/title';

export default () => (
  <div>
    <EuiText>
      <EuiTitle size="xxs">
        <h4>Visually hide content</h4>
      </EuiTitle>
      <p>
        <em>
          Use a screenreader to verify that there is a second paragraph in this
          example:
        </em>
      </p>
      <p>This is the first paragraph. It is visible to all.</p>
      <EuiScreenReaderOnly>
        <p>
          This is the second paragraph. It is hidden for sighted users but
          visible to screen readers.
        </p>
      </EuiScreenReaderOnly>
      <p>This is the third paragraph. It is visible to all.</p>
      <EuiTitle size="xxs">
        <h4>Show on focus</h4>
      </EuiTitle>
      <p>
        <em>
          In certain cases, you may want to display screen reader-only content
          when it is in focus. This can be accoplished by adding the{' '}
          <EuiCode>showOnFocus</EuiCode> prop. For example, tabbing through this
          section with your keyboard will display a &lsquo;Skip to content
          &rsquo; link:
        </em>
      </p>
      <p>
        This link is visible to all on focus:{' '}
        <EuiScreenReaderOnly showOnFocus>
          <a href="#">Skip to content</a>
        </EuiScreenReaderOnly>
      </p>
    </EuiText>
  </div>
);
