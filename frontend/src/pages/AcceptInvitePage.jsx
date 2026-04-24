import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/useProjectStore";

const AcceptInvitePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { acceptInvite } = useProjectStore();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const handleAccept = async () => {
      try {
        // decode token to get projectId (quick trick below)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const projectId = payload.projectId;

        const res = await acceptInvite(token);

        if (res.success) {
          setStatus("success");

          setTimeout(() => {
            navigate(`/projects/${projectId}`);
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    handleAccept();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      {status === "loading" && <p>Accepting invitation...</p>}
      {status === "success" && <p>✅ Invitation accepted! Redirecting...</p>}
      {status === "error" && <p>❌ Invalid or expired invite link</p>}
    </div>
  );
};

export default AcceptInvitePage;