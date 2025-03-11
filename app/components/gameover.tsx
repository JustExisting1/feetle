import React, {
  useEffect,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type DetailedHTMLProps,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type Ref,
} from "react";
import { Modal } from "react-bootstrap";
import { NavLink } from "react-router";

export default function GameOverModal({
  show,
  score,
}: {
  show: boolean;
  score: number;
}) {
  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <div
        popover="auto"
        className="flex w-96 h-48 place-self-center border-2 p-2 border-league-gold text-white bg-black rounded-2xl">
        <div className="flex flex-col size-full gap-4 rounded-md place-items-center place-content-between p-2">
          <h1 className="text-4xl">Game Over</h1>
          <div className="w-full h-full rounded-md place-content-center">
            <div className="text-3xl text-center">Score:{score}</div>
          </div>
          <div className="flex flex-row w-full text-center place-content-evenly">
            <NavLink
              className="bg-destructive w-1/3 rounded-lg p-2 hover:brightness-125"
              to="/">
              Home
            </NavLink>
            <button
              className="bg-league-gold w-1/3 rounded-lg p-2 hover:brightness-125"
              onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
