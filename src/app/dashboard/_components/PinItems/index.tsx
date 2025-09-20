import { useState } from "react";
import Icon from "@/app/dashboard/_components/Icon";
import Modal from "@/app/dashboard/_components/Modal";
import Image from "@/app/dashboard/_components/Image";
import Button from "@/app/dashboard/_components/Button";
import { releasedPosts } from "@/app/dashboard/_mocks/posts";
import DisplayCoverImage from "@/app/dashboard/_components/DisplayCoverImage";
import { Media } from "@/payload-types";

type PinItemsProps = {
  items?: (string | number)[];
  image?: string | Media | null;
  onClick: () => Promise<void>;
  isLargeButton?: boolean;
};

const PinItems = ({
  items = [],
  image,
  onClick,
  isLargeButton,
}: PinItemsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {isLargeButton ? (
        <Button className="ml-3" isBlack onClick={() => setOpen(true)}>
          Pin
        </Button>
      ) : (
        <button className="action" onClick={() => setOpen(true)}>
          <Icon name="pin" />
          Pin
        </button>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-wrap gap-5 mb-8 max-md:gap-3">
          {items?.length ? (
            releasedPosts
              .filter((post) => items.includes(post.id))
              .map((post) => (
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden"
                  key={post.id}
                >
                  <Image
                    className="object-cover"
                    src={post.image}
                    fill
                    alt={post.title}
                  />
                </div>
              ))
          ) : (
            <DisplayCoverImage
              image={image}
              imageClass="size-20 rounded-2xl opacity-100 object-cover"
              lostClass="size-20 rounded-2xl"
            />
          )}
        </div>
        <div className="mb-4 text-h4 max-md:text-h5">
          Pin {items.length > 1 ? `${items.length} posts` : "post"}!
        </div>
        <div className="mb-8 text-body-2 font-medium text-t-tertiary">
          You’re pining {items.length > 1 ? `${items.length} posts` : "post"}.
          The selected post{items.length > 1 ? "s" : ""} will be pinned in your
          posts, and this action can be undone at any time.
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button className="flex-1" isStroke onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            isBlack
            onClick={() => onClick().finally(() => setOpen(false))}
          >
            Let’s do it
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PinItems;
