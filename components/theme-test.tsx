'use client';

export function ThemeTestComponent() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-h1 text-primary-600 font-bold">🎨 Rental Guru Theme System</h1>
        <p className="text-body text-neutral-text-secondary">Testing Urbanist font family and design tokens</p>
      </div>

      {/* Typography Test */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Typography Scale</h2>
        <div className="space-y-2 p-4 bg-neutral-surface rounded-lg">
          <h1 className="text-h1">Heading 1 - 40px (Urbanist Bold)</h1>
          <h2 className="text-h2">Heading 2 - 32px (Urbanist Bold)</h2>
          <h3 className="text-h3">Heading 3 - 24px (Urbanist SemiBold)</h3>
          <p className="text-body">Body Text - 16px (Urbanist Regular)</p>
          <p className="text-small text-neutral-text-secondary">Small Text - 12px (Urbanist Regular)</p>
        </div>
      </section>

      {/* Color Palette Test */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Brand Colors</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-h3 mb-3">Primary Purple</h3>
            <div className="grid grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="space-y-1">
                  <div 
                    className={`w-full h-12 rounded-md bg-primary-${shade} ${shade >= 500 ? 'border border-gray-200' : ''}`}
                  />
                  <span className="text-xs text-neutral-text-secondary block text-center">{shade}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-h3 mb-3">Secondary Cyan</h3>
            <div className="grid grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="space-y-1">
                  <div 
                    className={`w-full h-12 rounded-md bg-secondary-${shade} ${shade >= 500 ? 'border border-gray-200' : ''}`}
                  />
                  <span className="text-xs text-neutral-text-secondary block text-center">{shade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Semantic Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="w-full h-8 bg-red-500 rounded-md mb-2"></div>
            <h4 className="text-body font-medium text-red-700">Error</h4>
            <p className="text-small text-red-600">#F04438</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="w-full h-8 bg-amber-500 rounded-md mb-2"></div>
            <h4 className="text-body font-medium text-amber-700">Warning</h4>
            <p className="text-small text-amber-600">#F79009</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="w-full h-8 bg-green-500 rounded-md mb-2"></div>
            <h4 className="text-body font-medium text-primary-700">Success</h4>
            <p className="text-small text-primary-600">#17B26A</p>
          </div>
        </div>
      </section>

      {/* Component Examples */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Component Examples</h2>
        <div className="space-y-4">
          {/* Buttons */}
          <div className="p-4 bg-neutral-surface rounded-lg">
            <h3 className="text-h3 mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                Outline Button
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Error Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="p-4 bg-neutral-surface rounded-lg">
            <h3 className="text-h3 mb-3">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-border rounded-lg shadow-sm">
                <h4 className="text-body font-medium text-neutral-text-primary mb-2">Basic Card</h4>
                <p className="text-small text-neutral-text-secondary">This is a basic card with proper spacing and typography.</p>
              </div>
              <div className="p-4 bg-white border border-neutral-border rounded-lg shadow-md">
                <h4 className="text-body font-medium text-primary-600 mb-2">Featured Card</h4>
                <p className="text-small text-neutral-text-secondary">This is a featured card with elevated shadow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing System */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Spacing System</h2>
        <div className="p-4 bg-neutral-surface rounded-lg space-y-3">
          {[
            { name: 'xs', value: '4px' },
            { name: 'sm', value: '8px' },
            { name: 'md', value: '16px' },
            { name: 'lg', value: '24px' },
            { name: 'xl', value: '32px' }
          ].map((space) => (
            <div key={space.name} className="flex items-center space-x-4">
              <div 
                className="bg-primary-200 rounded" 
                style={{ width: space.value, height: '16px' }}
              />
              <span className="text-small text-neutral-text-secondary">
                {space.name}: {space.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Font Family Verification */}
      <section className="space-y-4">
        <h2 className="text-h2 text-neutral-text-primary">Font Family Test</h2>
        <div className="p-4 bg-neutral-surface rounded-lg">
          <p className="text-body mb-2">
            This text should be displayed in <strong>Urbanist</strong> font family. 
            You can inspect this element in your browser's developer tools to verify the font is loading correctly.
          </p>
          <div className="text-small text-neutral-text-secondary p-2 bg-gray-100 rounded font-mono">
            font-family: 'Urbanist', ui-sans-serif, system-ui, sans-serif
          </div>
        </div>
      </section>
    </div>
  );
}