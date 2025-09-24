"use strict";
(self.webpackChunkMatchup = self.webpackChunkMatchup || []).push([
  [191],
  {
    5191: (e, s, a) => {
      a.r(s), a.d(s, { default: () => p });
      var t = a(5043),
        r = a(3216),
        i = a(5475),
        n = a(3768),
        d = a(9456),
        l = a(6999),
        c = a(2573),
        o = a(579);
      const p = () => {
        var e;
        const [s, a] = (0, t.useState)([]),
          [p, u] = (0, t.useState)([]),
          h = (0, d.wA)(),
          m = (0, r.Zp)(),
          x = localStorage.getItem("userData"),
          g = x ? JSON.parse(x) : null,
          b =
            null === g || void 0 === g || null === (e = g.data) || void 0 === e
              ? void 0
              : e._id;
        (0, t.useEffect)(() => {
          (async () => {
            try {
              const e = (
                await h(
                  (0, c.wC)({
                    token: "68d103d5aa4b176726e60421",
                    page_no: 1,
                    page_size: 1e3,
                  })
                )
              ).payload.data;
              u(e);
            } catch (e) {
              n.Ay.error("Failed to load interests");
            }
          })();
        }, [h]);
        return (0, o.jsxs)("div", {
          className: "container padding-top padding-bottom",
          children: [
            (0, o.jsxs)("div", {
              className: "row text-center",
              children: [
                (0, o.jsx)("h2", {
                  className: "mb-4",
                  children: "Select Your Interests",
                }),
                (0, o.jsx)("div", {
                  className: "col",
                  children: p.map((e, t) =>
                    (0, o.jsx)(
                      i.N_,
                      {
                        style: {
                          border:
                            "1px solid " +
                            (s.includes(e) ? "#d63384" : "lightgray"),
                          margin: "10px 10px 10px 10px",
                          padding: "5px 12px",
                          borderRadius: "25px",
                          cursor: "pointer",
                        },
                        className:
                          "interest-item flex-nowrap " +
                          (s.includes(e) ? "selected" : ""),
                        onClick: () =>
                          ((e) => {
                            s.includes(e)
                              ? a((s) => s.filter((s) => s !== e))
                              : a((s) => [...s, e]);
                          })(e),
                        children: e.name,
                      },
                      t
                    )
                  ),
                }),
              ],
            }),
            (0, o.jsx)("div", {
              className: "col-4 mt-4",
              children:
                s.length > 0
                  ? (0, o.jsx)("button", {
                      className: "default-btn reverse",
                      onClick: async () => {
                        try {
                          const e = s.map((e) => e._id || e.id || e);
                          await n.Ay.promise(
                            h((0, l.dq)({ userId: b, interests: e })),
                            {
                              loading: "Saving your interests \ud83d\ude0d...",
                              success: (0, o.jsx)("b", {
                                children: "Settings saved! Redirecting...",
                              }),
                              error: (0, o.jsx)("b", {
                                children: "Could not save. Please try again.",
                              }),
                            }
                          ),
                            m("/metrimonial/add-photos");
                        } catch (e) {
                          n.Ay.error(
                            "Error submitting interests. Please try again."
                          );
                        }
                      },
                      children: (0, o.jsx)("span", {
                        children: "Submit your interests",
                      }),
                    })
                  : (0, o.jsx)("button", {
                      className: "default-btn reverse",
                      onClick: () => m("/metrimonial/add-photos"),
                      children: (0, o.jsx)("span", { children: "Skip" }),
                    }),
            }),
          ],
        });
      };
    },
  },
]);
//# sourceMappingURL=191.47dbbcb4.chunk.js.map
