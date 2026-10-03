import { type CSSProperties, Fragment } from "react";

import styles from "./neon.module.css";

type NeonStyle = CSSProperties & {
  "--neon-color"?: string;
  "--neon-delay"?: string;
};

type NeonTextProps = {
  children: string;
  /** Design token or CSS colour for the tubes. */
  color: string;
};

type NeonWordProps = {
  word: string;
  ignite: "stutter" | "catch";
  delay: number;
  weak: boolean;
};

// The first word catches just after the page appears, and each later word follows it.
const firstTubeDelay = 300;
const tubeStagger = 160;

function NeonText({ children, color }: NeonTextProps) {
  const words = children.split(" ");
  const style: NeonStyle = { "--neon-color": color };

  return (
    <span className={styles.text} style={style}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 ? " " : null}
          <NeonWord
            word={word}
            ignite={index % 2 === 0 ? "stutter" : "catch"}
            delay={firstTubeDelay + index * tubeStagger}
            weak={index === words.length - 1}
          />
        </Fragment>
      ))}
    </span>
  );
}

// A word is one tube. In the last word the middle letter is a weak tube of its own: it catches
// after the rest and falters every so often.
function NeonWord({ word, ignite, delay, weak }: NeonWordProps) {
  const style: NeonStyle = { "--neon-delay": `${delay}ms` };
  const weakIndex = Math.floor(word.length / 2);

  if (!weak || word.length < 3) {
    return (
      <span className={styles.word} data-ignite={ignite} style={style}>
        {word}
      </span>
    );
  }

  return (
    <>
      <span className={styles.word} data-ignite={ignite} style={style}>
        {word.slice(0, weakIndex)}
      </span>
      <span className={styles.word} data-weak style={style}>
        {word[weakIndex]}
      </span>
      <span className={styles.word} data-ignite={ignite} style={style}>
        {word.slice(weakIndex + 1)}
      </span>
    </>
  );
}

export { NeonText };
