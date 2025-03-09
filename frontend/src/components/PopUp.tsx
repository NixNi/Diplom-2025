import React from "react";

interface PopUpProps {
  children: React.ReactNode;
  toggle: (state: boolean) => void;
  refetch?: () => void;
  isOpen: boolean;
}

const PopUp = (props: PopUpProps) => {
  return (
    <div>
      {props.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => {
            props.toggle(false);
          }}
        >
          <div
            className="bg-emerald-9 p-6"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex justify-end"></div>
            <div>
              {React.Children.map(props.children, (child) =>
                React.cloneElement(child as React.ReactElement, {
                  onClose: () => {
                    props.toggle(false);
                    setTimeout(() => {
                      if (props.refetch) props.refetch();
                    }, 400);
                  },
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUp;
