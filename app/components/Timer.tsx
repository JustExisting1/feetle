import { useEffect, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router";

export default function Timer({
  startTime,
  ref,
}: {
  startTime: number;
  ref?: any;
}) {
  const navigate = useNavigate();
  const [state, setState] = useState<number>(1);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + startTime * 1000)
  );

  const timeDiff = (time: Date) => {
    return time.getTime() - Date.now();
  };

  const minutes = (time: number) => {
    return Math.floor((time - 1) / 60000);
  };

  const seconds = (time: number) => {
    time = time / 1000;
    return Math.floor(time % 60);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        reduceTimer() {
          setDeadline(new Date(deadline.getTime() - 30 * 1000));
          setState(state * -1);

          if (timeDiff(deadline) <= 0) {
            //redirect to scoreboard indead
            navigate("/");
          }
        },
      };
    },
    [state]
  );

  useEffect(() => {
    setTimeout(() => {
      //update each second
      if (timeDiff(deadline) <= 0) {
        //redirect to scoreboard indead
        navigate("/");
      }

      setState(state * -1);
    }, 1000);
  }, [state]);

  const returnTime = () => {
    if (timeDiff(deadline) <= 0) {
      return <div> 0:00</div>;
    }
    return (
      <div>
        {minutes(timeDiff(deadline))}:
        {seconds(timeDiff(deadline)) < 10
          ? "0" + seconds(timeDiff(deadline))
          : seconds(timeDiff(deadline))}
      </div>
    );
  };

  return returnTime();
}
