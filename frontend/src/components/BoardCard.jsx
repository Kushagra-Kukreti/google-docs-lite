import { Card, CardContent, Typography, IconButton, Tooltip, Avatar, AvatarGroup } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

export default function BoardCard({ board, onMenuOpen }) {
  return (
    <Card
      className="relative rounded-2xl bg-white cursor-pointer"
      sx={{
        border: "1px solid #eaeaea",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px) scale(1.02)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <Typography
            variant="h6"
            className="font-semibold text-gray-800 tracking-wide"
          >
            {board.name}
          </Typography>
          <Tooltip title="More options">
            <IconButton
              onClick={(e) => onMenuOpen(e, board)}
              size="small"
              className="hover:bg-gray-100"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Members as Avatars */}
        <div>
          <Typography
            variant="subtitle2"
            className="text-gray-500 uppercase text-xs tracking-wide mb-1"
          >
            Members
          </Typography>
          <div className="mt-2">
            {board.members?.length > 0 ? (
              <AvatarGroup max={5}>
                {console.log("board members",board.members)
                }
                {board.members.map((m) => (
                  <Avatar
                    key={m.uid || m}
                    alt={m.displayName || m}
                    src={m.photoURL || ""}
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: 16,
                      bgcolor: m.photoURL ? "transparent" : "linear-gradient(135deg, #6C5DD3, #2CA8FF)",
                      color: "white",
                    }}
                  >
                    {(m.displayName || m)[0].toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
            ) : (
              <span className="text-gray-400 italic text-sm">No members yet</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
