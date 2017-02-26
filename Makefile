# 示例：make dev desc=重构代码
export desc
export envName
dev:
	sh ci.sh dev $(desc)
dev-hanrui:
	sh ci.sh dev-hanrui $(desc)
test:
	sh ci.sh test $(desc)
beta:
	sh ci.sh test $(desc)
feature:
	sh ci.sh feature-merge $(desc)
master:
	sh ci.sh master $(desc)

.PHONY: beta dev test feature master dev-hanrui
