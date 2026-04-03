import React from "react";
import { Disclosure } from "@headlessui/react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const PlayFilersComp = (props) => {
  return (
    <div className="my-3">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="py-3 px-2 flex items-center gap-3 w-full rounded-sm">
              {open ? <BiChevronUp /> : <BiChevronDown />}
              <span className={open ? "text-red-600" : "text-gray-700"}>
                {props.title}
              </span>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-3 flex-wrap">
                {props.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 px-3 py-1 rounded"
                  >
                    <button className="text-red-600">{tag}</button>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default PlayFilersComp;
