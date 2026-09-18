export function parseCommand(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { valid: false, error: 'Empty input.' };
  }

  const input = rawInput.trim();

  const printMatch = input.match(/^print\((['"])(.*?)\1\)$/i) ;
  if (printMatch) {
    return {
      valid: true,
      action: 'print',
      text: printMatch[2]
    };
  }

  const moveMatch = input.match(/^player_move_(up|down|left|right)\((\d+)\)$/i);
  if (moveMatch) {
    return {
      valid: true,
      action: 'move',
      direction: moveMatch[1].toLowerCase(),
      steps: parseInt(moveMatch[2], 10)
    };
  }

  const varMatch = input.match(/^(?:let\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(\d+);?$/);
  if (varMatch) {
    return {
      valid: true,
      action: 'assign_var',
      varName: varMatch[1],
      value: parseInt(varMatch[2], 10)
    };
  }



  const cmd = input.toLocaleLowerCase();
  if (cmd === 'help') return { valid: true, action: 'help' };
  if (cmd === 'clear') return { valid: true, action: 'clear' };
 
  return {
    valid: false,
    error: `Unknown command: '${input}' . Try print("your_word") or player_move_right(1).`
  };
}
