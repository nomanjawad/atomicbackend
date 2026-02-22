/**
 * EditorHelpText - Reusable help/info component for Editor.js
 * Shows keyboard shortcuts and features
 */
export default function EditorHelpText({ features = [] }) {
  const defaultFeatures = [
    { text: 'Press Tab or / to see all available blocks', kbd: ['Tab', '/'] },
    { text: 'Change heading level: Click the settings icon (⚙️) on the right side of any header block to select H1-H6' },
    { text: 'Drag & drop blocks to reorder' },
    { text: 'Cmd/Ctrl + Z/Y for undo/redo', kbd: ['Cmd/Ctrl', 'Z', 'Y'] },
    { text: 'Upload images by selecting or dragging files' },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div className="text-sm text-blue-700 dark:text-blue-300">
        <p className="font-medium mb-1">Editor.js Features:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          {displayFeatures.map((feature, index) => (
            <li key={index}>
              {feature.text}
              {feature.kbd && feature.kbd.length > 0 && (
                <>
                  {' '}
                  {feature.kbd.map((key, i) => (
                    <kbd key={i} className="px-1 py-0.5 bg-white dark:bg-gray-700 border rounded ml-1">
                      {key}
                    </kbd>
                  ))}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
