import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function ShareModal({ open, onClose, board, onInvite }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) setEmail("");
  }, [open]);

  const handleInvite = async() => {
    if (!email.trim()) return;
    try {
      // const userInfo = await getUser(email);
      onInvite(board.id, email);
      setEmail("");
    } catch (error) {
       console.log("Error in user fetching",error);
       
    }
  };

  if (!board) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Share Board: {board.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter user UID / Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <div className="mt-4">
          <h3 className="font-bold mb-2">Current Members:</h3>
          <ul className="list-disc ml-6">
            {board.members?.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleInvite} variant="contained">Invite</Button>
      </DialogActions>
    </Dialog>
  );
}
