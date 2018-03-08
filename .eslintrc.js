module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-filename-extension": "off",
        "react/jsx-indent-props": ["error", 4],
        "padded-blocks": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "max-len": ["warn", 150],
        "jsx-a11y/no-static-element-interactions": "off",
        "react/no-array-index-key": "off",
        "padded-blocks": "off",
        "react/forbid-prop-types": "off",
        "jsx-a11y/no-autofocus": "off",
        "no-mixed-operators": "off",
    },
    "globals": { "visitAmount": true}
};