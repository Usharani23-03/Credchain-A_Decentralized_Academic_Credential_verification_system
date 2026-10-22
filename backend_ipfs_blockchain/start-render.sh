```sh
#!/bin/sh

ssh -vv \
  -i /etc/secrets/credchain-render-tunnel \
  -o IdentitiesOnly=yes \
  -o BatchMode=yes \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -o UserKnownHostsFile=/etc/secrets/known_hosts \
  -o StrictHostKeyChecking=yes \
  -N -L 127.0.0.1:7051:100.123.252.62:17051 \
  credchain-tunnel@52.65.221.32 &

SSH_PID=$!
sleep 5

if ! kill -0 "$SSH_PID" 2>/dev/null; then
  wait "$SSH_PID"
  exit 1
fi

npm start
```