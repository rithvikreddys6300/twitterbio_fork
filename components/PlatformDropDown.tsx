import { Menu, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type PlatformType = "Twitter/X" | "Instagram" | "LinkedIn" | "TikTok" | "Facebook";

interface PlatformDropDownProps {
  platform: PlatformType;
  setPlatform: (platform: PlatformType) => void;
}

const platforms: { 
  name: PlatformType; 
  charLimit: number;
  description: string;
}[] = [
  { name: "Twitter/X", charLimit: 300, description: "Short and engaging" },
  { name: "Instagram", charLimit: 150, description: "Creative and visual" },
  { name: "LinkedIn", charLimit: 220, description: "Professional network" },
  { name: "TikTok", charLimit: 80, description: "Fun and catchy" },
  { name: "Facebook", charLimit: 255, description: "Personal connection" },
];

export default function PlatformDropDown({ platform, setPlatform }: PlatformDropDownProps) {
  const currentPlatform = platforms.find(p => p.name === platform);
  
  return (
    <Menu as="div" className="relative block text-left w-full">
      <div>
        <Menu.Button 
          className="inline-flex w-full justify-between items-center rounded-xl 
                     px-4 py-3 text-lg shadow-custom hover-scale
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
            border: '2px solid'
          }}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{platform}</span>
            <span 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentPlatform?.charLimit} character limit • {currentPlatform?.description}
            </span>
          </div>
          <ChevronUpIcon
            className="-mr-1 ml-2 h-5 w-5 ui-open:hidden flex-shrink-0"
            aria-hidden="true"
          />
          <ChevronDownIcon
            className="-mr-1 ml-2 h-5 w-5 hidden ui-open:block flex-shrink-0"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute left-0 z-10 mt-2 w-full origin-top-right 
                     rounded-xl shadow-custom-lg ring-1 ring-gray-300 ring-opacity-5 
                     focus:outline-none overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)'
          }}
          key={platform}
        >
          <div>
            {platforms.map((platformItem) => (
              <Menu.Item key={platformItem.name}>
                {({ active }) => (
                  <button
                    onClick={() => setPlatform(platformItem.name)}
                    className={classNames(
                      "px-4 py-3 text-lg w-full text-left flex items-center justify-between transition-colors duration-200",
                      active ? "opacity-80" : "",
                      platform === platformItem.name ? "font-semibold" : ""
                    )}
                    style={{
                      backgroundColor: active ? 'var(--bg-tertiary)' : 'transparent',
                      color: platform === platformItem.name ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{platformItem.name}</span>
                      <span 
                        className="text-sm"
                        style={{ 
                          color: platform === platformItem.name 
                            ? 'var(--accent-secondary)' 
                            : 'var(--text-secondary)' 
                        }}
                      >
                        {platformItem.charLimit} chars • {platformItem.description}
                      </span>
                    </div>
                    {platform === platformItem.name ? (
                      <CheckIcon 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: 'var(--accent-primary)' }}
                      />
                    ) : null}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export { platforms };
