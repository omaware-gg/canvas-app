'use client'

import { useState } from "react";
import { HexColorPicker } from "react-colorful";


export default function Picker() {
  const [color, setColor] = useState("#000000");

  return <HexColorPicker color={color} onChange={setColor} />
}